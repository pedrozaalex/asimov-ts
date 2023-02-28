import { Entity, ISystem } from '@asimov-ts/core'
import { toNullable } from 'fp-ts/lib/Option'
import { AABBCollider, TransformComponent } from '../components'

export class CollisionSystem implements ISystem {
	name = 'CollisionSystem'

	filter(entity: Entity) {
		return (
			entity.hasComponent(AABBCollider) &&
			entity.hasComponent(TransformComponent)
		)
	}

	update(params: { deltaTime: number; entities: Entity[] }) {
		const { entities } = params

		entities.forEach(entity => {
			const transform = toNullable(entity.getComponentValue(TransformComponent))
			const collider = toNullable(entity.getComponentValue(AABBCollider))

			if (!collider || !transform) return

			entities.forEach(other => {
				if (other.id === entity.id) return

				const otherTransform = toNullable(
					other.getComponentValue(TransformComponent)
				)
				const otherCollider = toNullable(other.getComponentValue(AABBCollider))

				if (!otherCollider || !otherTransform) return

				const { x, y } = transform
				const { x: otherX, y: otherY } = otherTransform

				const { width, height } = collider
				const { width: otherWidth, height: otherHeight } = otherCollider

				if (
					x < otherX + otherWidth &&
					x + width > otherX &&
					y < otherY + otherHeight &&
					y + height > otherY
				) {
					collider.onCollision?.(other)
				}
			})
		})
	}
}
