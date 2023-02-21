import { Entity, ISystem } from '@asimov/core'
import { isNone, isSome } from 'fp-ts/lib/Option'
import { clearCanvas, drawCircle, drawRect } from '@asimov/web'
import {
	CircleComponent,
	isDrawable,
	RectangleComponent,
	SquareComponent,
	TransformComponent,
} from '../components'

type Circle = {
	type: 'circle'
	x: number
	y: number
	radius: number
	color: string
	zIndex: number
}

type Rectangle = {
	type: 'rectangle'
	x: number
	y: number
	width: number
	height: number
	color: string
	zIndex: number
}

export class RenderingSystem implements ISystem {
	name = 'RenderingSystem'

	filter(entity: Entity) {
		return entity.hasComponent(TransformComponent) && isDrawable(entity)
	}

	update(params: { deltaTime: number; entities: Entity[] }) {
		clearCanvas()

		const { entities } = params
		const drawables: (Circle | Rectangle)[] = []

		entities.forEach(entity => {
			const transform = entity.getComponentValue(TransformComponent)
			const square = entity.getComponentValue(SquareComponent)
			const circle = entity.getComponentValue(CircleComponent)
			const rectangle = entity.getComponentValue(RectangleComponent)

			if (isNone(transform)) return
			if (isNone(square) && isNone(circle) && isNone(rectangle)) return

			if (isSome(square)) {
				drawables.push({
					type: 'rectangle',
					x: transform.value.x,
					y: transform.value.y,
					width: square.value.sideLength,
					height: square.value.sideLength,
					color: square.value.color,
					zIndex: square.value.zIndex,
				})
			}

			if (isSome(circle)) {
				drawables.push({
					type: 'circle',
					x: transform.value.x,
					y: transform.value.y,
					radius: circle.value.radius,
					color: circle.value.color,
					zIndex: circle.value.zIndex,
				})
			}

			if (isSome(rectangle)) {
				drawables.push({
					type: 'rectangle',
					x: transform.value.x,
					y: transform.value.y,
					width: rectangle.value.width,
					height: rectangle.value.height,
					color: rectangle.value.color,
					zIndex: rectangle.value.zIndex,
				})
			}
		})

		drawables.sort((a, b) => a.zIndex - b.zIndex)

		drawables.forEach(drawable => {
			switch (drawable.type) {
				case 'circle':
					drawCircle({
						x: drawable.x,
						y: drawable.y,
						radius: drawable.radius,
						color: drawable.color,
					})
					break
				case 'rectangle':
					drawRect({
						x: drawable.x,
						y: drawable.y,
						width: drawable.width,
						height: drawable.height,
						color: drawable.color,
					})
					break
				default:
					break
			}
		})
	}
}
