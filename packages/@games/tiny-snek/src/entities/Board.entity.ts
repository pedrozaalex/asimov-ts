import { Component, Entity, IBuildable, IComponentValue } from '@asimov/core'
import { SquareComponent, TransformComponent } from '../components'
import { Wall } from './Wall.entity'

// new Wall(0, 0, WALL_THICKNESS, BOARD_HEIGHT),
// new Wall(0, 0, BOARD_WIDTH, WALL_THICKNESS),
// new Wall(BOARD_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, BOARD_HEIGHT),
// new Wall(0, BOARD_HEIGHT - WALL_THICKNESS, BOARD_WIDTH, WALL_THICKNESS),

export class Board extends Entity implements IBuildable {
	constructor(
		private _width: number,
		private _height: number,
		private _wallThickness: number,
		private _horizontalSquareCount: number,
		private _verticalSquareCount: number
	) {
		super()
	}

	private buildWalls() {
		return [
			...new Wall(0, 0, this._wallThickness, this._height).getComponents(),
			...new Wall(0, 0, this._width, this._wallThickness).getComponents(),
			...new Wall(
				this._width - this._wallThickness,
				0,
				this._wallThickness,
				this._height
			).getComponents(),
			...new Wall(
				0,
				this._height - this._wallThickness,
				this._width,
				this._wallThickness
			).getComponents(),
		]
	}

	private square(x: number, y: number, size: number) {
		return [
			new TransformComponent(x, y, 0, 1),
			new SquareComponent(size, 'red', -1),
		]
	}

	private buildSquares() {
		const squareSize = this._width / this._horizontalSquareCount
		const squares: Component<IComponentValue>[] = []

		for (let x = 0; x < this._horizontalSquareCount; x++) {
			for (let y = 0; y < this._verticalSquareCount; y++) {
				squares.push(...this.square(x * squareSize, y * squareSize, squareSize))
			}
		}

		return squares
	}

	getComponents(): Component<IComponentValue>[] {
		return [...this.buildWalls(), ...this.buildSquares()]
	}
}
