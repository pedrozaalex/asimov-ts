import { Entity, IBuildable } from '@asimov/core'
import { toNullable } from 'fp-ts/lib/Option'
import { SquareComponent, TransformComponent } from '../components'
import { AABBCollider } from '../components/AABBCollider.component'
import { HazardComponent } from '../components/Hazard.component'
import { InputListener } from '../components/InputListener.component'
import { VelocityComponent } from '../components/Velocity.component'
import { addEntity } from '../entrypoint'
import { Food } from './Food.entity'
import { TailSegment } from './TailSegment.entity'

export const PLAYER_VELOCITY = 100
export const PLAYER_SIZE = 20
export const PLAYER_COLOR = 'green'

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

export class Player extends Entity implements IBuildable {
	private _x: number
	private _y: number

	private _pastPositions: { x: number; y: number }[] = []
	private _tailSegments: TailSegment[] = []

	constructor(x = 0, y = 0) {
		super()
		this._x = x
		this._y = y
	}

	public onMove(newPos: { x: number; y: number }) {
		this._pastPositions.push(newPos)

		if (this._pastPositions.length > this._tailSegments.length + 1) {
			this._pastPositions.shift()
		}

		this._tailSegments.forEach((segment, index) => {
			segment.moveTo(this._pastPositions[index])
		})
	}

	private getDirection() {
		const velocity = toNullable(this.getComponentValue(VelocityComponent))
		if (velocity === null) return Direction.Right
		return getDirectionFromVector(velocity)
	}

	public getInitialComponents() {
		return [
			new TransformComponent(this._x, this._y, 0, 1),
			new VelocityComponent(PLAYER_VELOCITY, 0),
			new SquareComponent(PLAYER_SIZE, PLAYER_COLOR),
			new AABBCollider({
				width: PLAYER_SIZE,
				height: PLAYER_SIZE,

				onCollision: other => {
					if (other.hasComponent(HazardComponent)) {
						// TODO: Game over
						console.log('Player died')
					}

					if (other instanceof Food) {
						const lastPos = this._pastPositions[this._pastPositions.length - 1]
						const newSegment = new TailSegment(lastPos)
						addEntity(newSegment)
						this._tailSegments.push(newSegment)
					}
				},
			}),
			new InputListener({
				ArrowUp: () => {
					const direction = this.getDirection()
					if (direction === Direction.Down) return
					this.setComponent(new VelocityComponent(0, -PLAYER_VELOCITY))
				},
				ArrowDown: () => {
					const direction = this.getDirection()
					if (direction === Direction.Up) return
					this.setComponent(new VelocityComponent(0, PLAYER_VELOCITY))
				},
				ArrowLeft: () => {
					const direction = this.getDirection()
					if (direction === Direction.Right) return
					this.setComponent(new VelocityComponent(-PLAYER_VELOCITY, 0))
				},
				ArrowRight: () => {
					const direction = this.getDirection()
					if (direction === Direction.Left) return
					this.setComponent(new VelocityComponent(PLAYER_VELOCITY, 0))
				},
			}),
		]
	}
}
