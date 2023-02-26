import { Entity, ISystem } from '@asimov/core'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse, isNone, toNullable } from 'fp-ts/lib/Option'
import { Player, StateTracker } from '../buildables'
import {
	GameStateComponent,
	PointsComponent,
	TransformComponent,
	VelocityComponent,
} from '../components'
import {
	BOARD_HEIGHT,
	BOARD_WIDTH,
	GameState,
	SQUARE_HEIGHT,
	SQUARE_WIDTH,
} from '../constants'
import { mapPointsToTimeBetweenTicks } from '../utils'

export function isMovementSystem(system: ISystem): system is MovementSystem {
	return system.name === 'MovementSystem'
}

export class MovementSystem implements ISystem {
	name = 'MovementSystem'

	filter(entity: Entity) {
		return (
			(entity.hasComponent(TransformComponent) &&
				entity.hasComponent(VelocityComponent)) ||
			entity.hasComponent(PointsComponent) ||
			entity instanceof StateTracker
		)
	}

	private counter = 0

	update({ deltaTime, entities }: { deltaTime: number; entities: Entity[] }) {
		const stateTracker = entities.find(e => e instanceof StateTracker)

		if (!stateTracker) {
			console.error(
				'Expected to find a StateTracker entity in the universe but none was found.'
			)

			return
		}

		const state = stateTracker.getComponentValue(GameStateComponent)

		if (isNone(state) || state?.value !== GameState.Running) return

		const playerPoints = entities
			.map(e =>
				pipe(
					e.getComponentValue(PointsComponent),
					getOrElse(() => 0)
				)
			)
			.reduce((a, b) => a + b, 0)

		const timeBetweenTicks = mapPointsToTimeBetweenTicks(playerPoints)

		this.counter += deltaTime

		if (this.counter < timeBetweenTicks) return

		this.counter = 0

		entities.forEach(entity => {
			const transform = toNullable(entity.getComponentValue(TransformComponent))
			const velocity = toNullable(entity.getComponentValue(VelocityComponent))

			if (!transform || !velocity) return

			const dx =
				Math.abs(velocity.dx) > 0
					? (SQUARE_WIDTH * velocity.dx) / Math.abs(velocity.dx)
					: 0
			let newX = (transform.x + dx) % BOARD_WIDTH
			newX = newX < 0 ? newX + BOARD_WIDTH : newX

			const dy =
				Math.abs(velocity.dy) > 0
					? (SQUARE_HEIGHT * velocity.dy) / Math.abs(velocity.dy)
					: 0
			let newY = (transform.y + dy) % BOARD_HEIGHT
			newY = newY < 0 ? newY + BOARD_HEIGHT : newY

			entity.setComponent(
				new TransformComponent(newX, newY, transform.rotation, transform.scale)
			)

			if (entity instanceof Player) {
				entity.onMove({ x: newX, y: newY })
			}
		})
	}
}
