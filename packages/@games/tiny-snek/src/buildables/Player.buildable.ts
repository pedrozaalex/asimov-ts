import { Entity, IBuildable } from '@asimov/core'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse, toNullable } from 'fp-ts/lib/Option'
import * as KeyCode from 'keycode-js'
import {
	AABBCollider,
	EventListener,
	EventQueue,
	HazardComponent,
	InputListener,
	SquareComponent,
	TransformComponent,
	VelocityComponent,
} from '../components'
import { NutritionComponent } from '../components/Nutrition.component'
import {
	PLAYER_COLOR,
	PLAYER_SIZE,
	PLAYER_VELOCITY,
	SQUARE_HEIGHT,
	SQUARE_WIDTH,
} from '../constants'
import { PlayerDiedEvent } from '../events'
import { GameEvent } from '../systems'
import { TailSegment } from './TailSegment.buildable'

enum Direction {
	Up,
	Down,
	Left,
	Right,
}

function getDirectionFromVector(axes: { dx: number; dy: number }) {
	if (axes.dx === 0 && axes.dy === 0) return Direction.Right

	if (Math.abs(axes.dx) > Math.abs(axes.dy)) {
		return axes.dx > 0 ? Direction.Right : Direction.Left
	} else {
		return axes.dy > 0 ? Direction.Down : Direction.Up
	}
}

const initialTransform = new TransformComponent(SQUARE_WIDTH, SQUARE_HEIGHT)

const initialVelocity = new VelocityComponent(PLAYER_VELOCITY, 0)

export class Player extends Entity implements IBuildable {
	private _pastPositions: { x: number; y: number }[] = []
	private _tailSegments: TailSegment[] = []
	private _currentPosition: { x: number; y: number } = {
		x: SQUARE_WIDTH,
		y: SQUARE_HEIGHT,
	}
	public onMove(newPos: { x: number; y: number }) {
		this._pastPositions.push(this._currentPosition)
		this._currentPosition = newPos

		if (this._pastPositions.length > this._tailSegments.length + 1) {
			this._pastPositions.shift()
		}

		this._tailSegments.forEach((segment, index) => {
			segment.moveTo(this._pastPositions[index + 1])
		})
	}

	private getDirection() {
		const velocity = toNullable(this.getComponentValue(VelocityComponent))
		if (velocity === null) return Direction.Right
		return getDirectionFromVector(velocity)
	}

	public getInitialComponents() {
		return [
			initialTransform,
			initialVelocity,
			new SquareComponent(PLAYER_SIZE, PLAYER_COLOR),
			new AABBCollider({
				width: PLAYER_SIZE,
				height: PLAYER_SIZE,

				onCollision: other => {
					if (other.hasComponent(HazardComponent)) {
						this.setComponent(EventQueue, queuedEvents => [
							...queuedEvents,
							new PlayerDiedEvent(),
						])
					}

					if (other.hasComponent(NutritionComponent)) {
						const nutritionalValue = pipe(
							other.getComponentValue(NutritionComponent),
							getOrElse(() => 0)
						)

						for (let i = 0; i < nutritionalValue; i++) {
							const lastPos = this._pastPositions[0]
							const newSegment = new TailSegment(lastPos)
							this._tailSegments.push(newSegment)
							this.addChild(newSegment)
						}
					}
				},
			}),
			new InputListener({
				[KeyCode.VALUE_UP]: () => {
					const direction = this.getDirection()
					if (direction === Direction.Down) return
					this.setComponent(new VelocityComponent(0, -PLAYER_VELOCITY))
				},

				[KeyCode.VALUE_DOWN]: () => {
					const direction = this.getDirection()
					if (direction === Direction.Up) return
					this.setComponent(new VelocityComponent(0, PLAYER_VELOCITY))
				},

				[KeyCode.VALUE_LEFT]: () => {
					const direction = this.getDirection()
					if (direction === Direction.Right) return
					this.setComponent(new VelocityComponent(-PLAYER_VELOCITY, 0))
				},

				[KeyCode.VALUE_RIGHT]: () => {
					const direction = this.getDirection()
					if (direction === Direction.Left) return
					this.setComponent(new VelocityComponent(PLAYER_VELOCITY, 0))
				},
			}),
			new EventQueue(),
			new EventListener({
				[GameEvent.OnGameRestart]: () => {
					this._pastPositions = []
					this._tailSegments.forEach(segment => this.removeChild(segment))
					this._tailSegments = []

					this.setComponent(initialTransform)
					this.setComponent(initialVelocity)
				},
			}),
		]
	}
}
