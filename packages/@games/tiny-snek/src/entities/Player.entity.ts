import { Entity, IBuildable } from '@asimov/core'
import { SquareComponent, TransformComponent } from '../components'
import { VelocityComponent } from '../components/Velocity.component'

export class Player extends Entity implements IBuildable {
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
			new VelocityComponent(10, 0),
			new SquareComponent(20, 'green'),
		]
	}
}
