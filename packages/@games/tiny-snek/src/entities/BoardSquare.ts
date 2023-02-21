import { Component, Entity, IBuildable, IComponentValue } from '@asimov/core'
import { SquareComponent, TransformComponent } from '../components'

export class BoardSquare extends Entity implements IBuildable {
	private _x: number
	private _y: number
	private _size: number

	constructor(params: { x: number; y: number; size: number }) {
		super()

		this._x = params.x
		this._y = params.y
		this._size = params.size
	}

	getComponents(): Component<IComponentValue>[] {
		return [
			new TransformComponent(this._x, this._y, 0, 1),
			new SquareComponent(this._size, 'white', -1),
		]
	}
}
