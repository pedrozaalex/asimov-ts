import { Entity, IBuildable } from '@asimov/core'
import { RectangleComponent, TransformComponent } from '../components'
import { AABBCollider } from '../components/AABBCollider.component'
import { HazardComponent } from '../components/Hazard.component'

export class Wall extends Entity implements IBuildable {
	private _x: number
	private _y: number
	private _width: number
	private _height: number

	constructor(x: number, y: number, width: number, height: number) {
		super()
		this._x = x
		this._y = y
		this._width = width
		this._height = height
	}

	public getComponents() {
		return [
			new TransformComponent(this._x, this._y, 0, 1),
			new RectangleComponent(this._width, this._height, 'black'),
			new AABBCollider({
				width: this._width,
				height: this._height,
				onCollision: () => undefined,
			}),
			new HazardComponent({ damage: 1 }),
		]
	}
}
