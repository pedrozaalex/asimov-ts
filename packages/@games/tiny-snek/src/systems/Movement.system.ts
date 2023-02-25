import { Entity, ISystem } from '@asimov/core'
import { toNullable } from 'fp-ts/lib/Option'
import { TransformComponent, VelocityComponent } from '../components'
import {
    BOARD_HEIGHT,
    BOARD_WIDTH,
    SQUARE_HEIGHT,
    SQUARE_WIDTH
} from '../constants'
import { Player } from '../entities'

export function isMovenentSystem(system: ISystem): system is MovementSystem {
	return system.name === 'MovementSystem'
}

export class MovementSystem implements ISystem {
	name = 'MovementSystem'

	filter(entity: Entity) {
		return (
			entity.hasComponent(TransformComponent) &&
			entity.hasComponent(VelocityComponent)
		)
	}

	private counter = 0
	private timeBetweenTicks = 0.4

	public increaseSpeed() {
		this.timeBetweenTicks *= 0.95
	}

	update({ deltaTime, entities }: { deltaTime: number; entities: Entity[] }) {
		this.counter += deltaTime

		if (this.counter < this.timeBetweenTicks) return

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
