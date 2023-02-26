import { Entity, IBuildable } from '@asimov/core'
import { map } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { getOrElseW } from 'fp-ts/lib/Option'
import {
	AABBCollider,
	CircleComponent,
	EventQueue,
	PlayerPositionTrackerComponent,
	TransformComponent,
} from '../components'
import { NutritionComponent } from '../components/Nutrition.component'
import {
	FOOD_COLOR,
	HORIZONTAL_SQUARE_COUNT,
	SQUARE_HEIGHT,
	SQUARE_WIDTH,
	VERTICAL_SQUARE_COUNT,
} from '../constants'
import { PlayerAteFoodEvent } from '../events'
import { Player } from './Player.buildable'

const SIZE = 9.5

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

type Pos2D = { x: number; y: number }

function convertGlobalToGridPosision(pos: Pos2D) {
	return {
		x: clamp(Math.floor(pos.x / SQUARE_WIDTH), 0, HORIZONTAL_SQUARE_COUNT - 1),
		y: clamp(Math.floor(pos.y / SQUARE_HEIGHT), 0, VERTICAL_SQUARE_COUNT - 1),
	}
}

function convertGridToGlobalPosition(pos: Pos2D) {
	return {
		x: pos.x * SQUARE_WIDTH,
		y: pos.y * SQUARE_HEIGHT,
	}
}

const boardSquaresAvailabilityMap = new Set<string>(
	Array.from({ length: HORIZONTAL_SQUARE_COUNT * VERTICAL_SQUARE_COUNT }).map(
		(_, index) => {
			const x = index % HORIZONTAL_SQUARE_COUNT
			const y = Math.floor(index / HORIZONTAL_SQUARE_COUNT)
			return `${x},${y}`
		}
	)
)

export class Food extends Entity implements IBuildable {
	private getRandomPosition() {
		const occupied = pipe(
			this.getComponentValue(PlayerPositionTrackerComponent),
			getOrElseW(() => []),
			map(convertGlobalToGridPosision)
		)

		const availableSquares = new Set(boardSquaresAvailabilityMap)
		occupied.forEach(({ x, y }) => availableSquares.delete(`${x},${y}`))

		const randomIndex = Math.floor(Math.random() * availableSquares.size)
		const randomPosition = Array.from(availableSquares)[randomIndex]

		const [x, y] = randomPosition.split(',').map(Number)

		return convertGridToGlobalPosition({ x, y })
	}

	public getInitialComponents() {
		const newPos = this.getRandomPosition()
		return [
			new TransformComponent(newPos.x, newPos.y),
			new CircleComponent(SIZE, FOOD_COLOR),
			new NutritionComponent(1),
			new AABBCollider({
				width: SIZE * 2,
				height: SIZE * 2,
				onCollision: other => {
					if (other instanceof Player) {
						const newPos = this.getRandomPosition()
						this.setComponent(new TransformComponent(newPos.x, newPos.y))

						this.setComponent(EventQueue, queuedEvents => {
							queuedEvents.push(new PlayerAteFoodEvent())
							return queuedEvents
						})
					}
				},
			}),
			new EventQueue(),
			new PlayerPositionTrackerComponent(),
		]
	}
}
