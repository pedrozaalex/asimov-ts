import { Entity, IBuildable } from '@asimov/core'
import { flatten } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse } from 'fp-ts/lib/Option'
import { AABBCollider, CircleComponent, TransformComponent } from '../components'
import {
    FOOD_COLOR, HORIZONTAL_SQUARE_COUNT, SQUARE_HEIGHT, SQUARE_WIDTH, VERTICAL_SQUARE_COUNT
} from '../constants'
import { onPlayerEatsFood } from '../entrypoint'
import { isMovenentSystem as isMovementSystem } from '../systems/Movement.system'
import { Player } from './Player.entity'
import { TailSegment } from './TailSegment.entity'

const SIZE = 9.5

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

const allBoardSquares = Array.from(
	{ length: HORIZONTAL_SQUARE_COUNT },
	(_, x) => Array.from({ length: VERTICAL_SQUARE_COUNT }, (_, y) => ({ x, y }))
)

export class Food extends Entity implements IBuildable {
	private getRandomPosition() {
		// the positions occupied by the player and the tail segments
		// in the format of { x: 0, y: 0 } where x and y are the indices
		// of the square in the grid. Therefore, the top left square isxs
		// { x: 0, y: 0 } and the bottom right square is
		// { x: HORIZONTAL_SQUARE_COUNT - 1, y: VERTICAL_SQUARE_COUNT - 1 }
		const occupied = this.getAllEntitiesInUniverse()
			.filter(e => e instanceof Player || e instanceof TailSegment)
			.map(e =>
				pipe(
					e.getComponentValue(TransformComponent),
					getOrElse(() => ({ x: 0, y: 0 }))
				)
			)
			.map(transform => ({
				x: clamp(
					Math.floor(transform.x / SQUARE_WIDTH),
					0,
					HORIZONTAL_SQUARE_COUNT - 1
				),
				y: clamp(
					Math.floor(transform.y / SQUARE_HEIGHT),
					0,
					VERTICAL_SQUARE_COUNT - 1
				),
			}))

		const availableSquares = flatten(
			occupied.reduce((acc, position) => {
				acc[position.x].slice(position.y, 1)
				return acc
			}, allBoardSquares)
		)

		const randomPosition =
			availableSquares[Math.floor(Math.random() * availableSquares.length)]

		return {
			x: randomPosition.x * SQUARE_WIDTH,
			y: randomPosition.y * SQUARE_HEIGHT,
		}
	}

	public getInitialComponents() {
		const newPos = this.getRandomPosition()
		return [
			new TransformComponent(newPos.x, newPos.y),
			new CircleComponent(SIZE, FOOD_COLOR),
			new AABBCollider({
				width: SIZE * 2,
				height: SIZE * 2,
				onCollision: other => {
					if (other instanceof Player) {
						const newPos = this.getRandomPosition()
						this.setComponent(new TransformComponent(newPos.x, newPos.y))
						onPlayerEatsFood()
						const [movementSystem] =
							this.getAllSystems().filter(isMovementSystem)
						movementSystem.increaseSpeed()
					}
				},
			}),
		]
	}
}
