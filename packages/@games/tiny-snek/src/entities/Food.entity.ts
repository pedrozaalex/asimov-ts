import { Entity, IBuildable } from '@asimov/core'
import { TransformComponent, CircleComponent } from '../components'
import { AABBCollider } from '../components/AABBCollider.component'

export class Food extends Entity implements IBuildable {
	private minX: number
	private maxX: number
	private minY: number
	private maxY: number
	
	constructor(params: { minX: number; maxX: number; minY: number; maxY: number }) {
		super()
		this.minX = params.minX
		this.maxX = params.maxX
		this.minY = params.minY
		this.maxY = params.maxY
	}

	private getRandomX() {
		return Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX
	}

	private getRandomY() {
		return Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY
	}

	public getComponents() {
		return [
			new TransformComponent(this.getRandomX(), this.getRandomY()),
			new CircleComponent(10, 'red'),
			new AABBCollider({
				width: 10,
				height: 10,
				onCollision: () => {
					this.setComponent(new TransformComponent(this.getRandomX(), this.getRandomY()))
				},
			})
		]
	}
}
