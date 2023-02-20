import { Entity, IBuildable } from '@asimov/core'
import { TransformComponent, CircleComponent } from '../components'
import { AABBCollider } from '../components/AABBCollider.component'

export class Food extends Entity implements IBuildable {
	private _x: number
	private _y: number

	constructor(x = 0, y = 0) {
		super()
		this._x = x
		this._y = y
	}

	public getComponents() {
		return [
			new TransformComponent(this._x, this._y, 0, 1),
			new CircleComponent(10, 'red'),
			new AABBCollider({
				width: 10,
				height: 10,
				onCollision: (other) => {
					console.log('food collided with', other.id)
				},
			})
		]
	}
}
