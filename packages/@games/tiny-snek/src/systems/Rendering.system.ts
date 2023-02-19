import { Entity, ISystem } from '@asimov/core'
import { isNone, isSome } from 'fp-ts/lib/Option'
import { drawCircle, drawRect } from '@asimov/web'
import {
	CircleComponent,
	isDrawable,
	RectangleComponent,
	SquareComponent,
	TransformComponent,
} from '../components'

export class RenderingSystem implements ISystem {
	name = 'RenderingSystem'

	filter(entity: Entity) {
		return entity.hasComponent(TransformComponent) && isDrawable(entity)
	}

	update(params: { deltaTime: number; entities: Entity[] }) {
		const { entities } = params

		entities.forEach(entity => {
			const transform = entity.getComponentValue(TransformComponent)
			const square = entity.getComponentValue(SquareComponent)
			const circle = entity.getComponentValue(CircleComponent)
			const rectangle = entity.getComponentValue(RectangleComponent)

      if (isNone(transform)) return
      if (isNone(square) && isNone(circle) && isNone(rectangle)) return

      if (isSome(square)) {
        drawRect({
          x: transform.value.x,
          y: transform.value.y,
          width: square.value.sideLength,
          height: square.value.sideLength,
          color: square.value.color,
        })
      }

      if (isSome(circle)) {
        drawCircle({
          x: transform.value.x,
          y: transform.value.y,
          radius: circle.value.radius,
          color: circle.value.color,
        })
      }

      if (isSome(rectangle)) {
        drawRect({
          x: transform.value.x,
          y: transform.value.y,
          width: rectangle.value.width,
          height: rectangle.value.height,
          color: rectangle.value.color,
        })
      }
		})
	}
}
