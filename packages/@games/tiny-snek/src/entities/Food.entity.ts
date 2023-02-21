import { Entity, IBuildable } from '@asimov/core'
import { CircleComponent, TransformComponent } from '../components'
import { AABBCollider } from '../components/AABBCollider.component'
import { increaseSpeed } from '../systems/Movement.system'

const SIZE = 10

export class Food extends Entity implements IBuildable {
	private minX: number
	private maxX: number
	private minY: number
	private maxY: number

	constructor(params: {
		minX: number
		maxX: number
		minY: number
		maxY: number
	}) {
		super()
		this.minX = params.minX
		this.maxX = params.maxX
		this.minY = params.minY
		this.maxY = params.maxY
	}

	private getRandomX() {
		return (
			Math.floor(Math.random() * (this.maxX - this.minX - SIZE)) + this.minX
		)
	}

	private getRandomY() {
		return (
			Math.floor(Math.random() * (this.maxY - this.minY - SIZE)) + this.minY
		)
	}

	public getComponents() {
		return [
			new TransformComponent(this.getRandomX(), this.getRandomY()),
			new CircleComponent(SIZE, 'red'),
			new AABBCollider({
				width: SIZE * 2,
				height: SIZE * 2,
				onCollision: () => {
					this.setComponent(
						new TransformComponent(this.getRandomX(), this.getRandomY())
					)
					increaseSpeed()
				},
			}),
		]
	}
}
