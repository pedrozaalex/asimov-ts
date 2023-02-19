import { Entity, ISystem } from '@asimov/core'
import { isSome } from 'fp-ts/lib/Option'
import invariant from 'tiny-invariant'
import { TransformComponent } from '../components'
import { VelocityComponent } from '../components/Velocity.component'

export class MovementSystem implements ISystem {
	name = 'MovementSystem'
	filter = (entity: Entity) =>
		entity.hasComponent(TransformComponent) &&
		entity.hasComponent(VelocityComponent)
	update = ({
		deltaTime,
		entities,
	}: {
		deltaTime: number
		entities: Entity[]
	}) => {
		entities.forEach(entity => {
			const transform = entity.getComponentValue(TransformComponent)
			const velocity = entity.getComponentValue(VelocityComponent)

			invariant(
				isSome(transform),
				'Expected entity to have a TransformComponent'
			)
			invariant(isSome(velocity), 'Expected entity to have a VelocityComponent')

			if (transform && velocity) {
				transform.value.x += velocity.value.dx * deltaTime
				transform.value.y += velocity.value.dy * deltaTime
			}

			entity.setComponent(
				new TransformComponent(
					transform.value.x,
					transform.value.y,
					transform.value.rotation,
					transform.value.scale
				)
			)
		})
	}
}
