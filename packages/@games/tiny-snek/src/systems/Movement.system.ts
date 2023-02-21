import { Entity, ISystem } from '@asimov/core'
import { toNullable } from 'fp-ts/lib/Option'
import { TransformComponent } from '../components'
import { VelocityComponent } from '../components/Velocity.component'
import {
	PLAYABLE_AREA_HEIGHT,
	PLAYABLE_AREA_WIDTH,
	SQUARE_HEIGHT,
	SQUARE_WIDTH,
	WALL_THICKNESS,
} from '../entrypoint'

let counter = 0

let timeBetweenTicks = 0.5

export const increaseSpeed = () => {
	timeBetweenTicks = Math.max(0.1, timeBetweenTicks - 0.1)
}

export class MovementSystem implements ISystem {
	name = 'MovementSystem'
	filter(entity: Entity) {
		return (
			entity.hasComponent(TransformComponent) &&
			entity.hasComponent(VelocityComponent)
		)
	}
	update({ deltaTime, entities }: { deltaTime: number; entities: Entity[] }) {
		counter += deltaTime

		if (counter < timeBetweenTicks) return

		counter = 0

		entities.forEach(entity => {
			const transform = toNullable(entity.getComponentValue(TransformComponent))
			const velocity = toNullable(entity.getComponentValue(VelocityComponent))

			if (!transform || !velocity) return

			const dx =
				Math.abs(velocity.dx) > 0
					? (SQUARE_WIDTH * velocity.dx) / Math.abs(velocity.dx)
					: 0
			const x = (transform.x + dx) % PLAYABLE_AREA_WIDTH
			const newX = x < 0 ? x + PLAYABLE_AREA_WIDTH : x
			const horizontalSquare = Math.floor(
				(newX - WALL_THICKNESS) / SQUARE_WIDTH
			)

			const dy =
				Math.abs(velocity.dy) > 0
					? (SQUARE_HEIGHT * velocity.dy) / Math.abs(velocity.dy)
					: 0
			const y = (transform.y + dy) % PLAYABLE_AREA_HEIGHT
			const newY = y < 0 ? y + PLAYABLE_AREA_HEIGHT : y
			const verticalSquare = Math.floor((newY - WALL_THICKNESS) / SQUARE_HEIGHT)

			console.log('PLAYER IS AT', horizontalSquare, verticalSquare)

			const newTransform = new TransformComponent(
				newX,
				newY,
				transform.rotation,
				transform.scale
			)

			entity.setComponent(newTransform)
		})
	}
}
