import { Entity, ISystem } from '@asimov/core'
import { toNullable } from 'fp-ts/lib/Option'
import { TransformComponent } from '../components'
import { VelocityComponent } from '../components/Velocity.component'

export class MovementSystem implements ISystem {
	name = 'MovementSystem'
	filter(entity: Entity) {
		return (
			entity.hasComponent(TransformComponent) &&
			entity.hasComponent(VelocityComponent)
		)
	}
	update({ deltaTime, entities }: { deltaTime: number; entities: Entity[] }) {
		entities.forEach(entity => {
			const transform = toNullable(entity.getComponentValue(TransformComponent))
			const velocity = toNullable(entity.getComponentValue(VelocityComponent))

			if (!transform || !velocity) return

			const newTransform = new TransformComponent(
				transform.x + velocity.dx * deltaTime,
				transform.y + velocity.dy * deltaTime,
				transform.rotation,
				transform.scale
			)

			entity.setComponent(newTransform)
		})
	}
}
