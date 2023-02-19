import { Component, Entity } from '@asimov/core'

interface IHasColor {
	color: string
}

interface Square extends IHasColor {
	shape: 'square'
	sideLength: number
}

interface Circle extends IHasColor {
	shape: 'circle'
	radius: number
}

interface Rectangle extends IHasColor {
	shape: 'rectangle'
	width: number
	height: number
}

export class SquareComponent extends Component<Square> {
	constructor(sideLength = 0, color = '') {
		super({ shape: 'square', sideLength, color })
	}
}

export class CircleComponent extends Component<Circle> {
	constructor(radius = 0, color = '') {
		super({ shape: 'circle', radius, color })
	}
}

export class RectangleComponent extends Component<Rectangle> {
	constructor(width = 0, height = 0, color = '') {
		super({ shape: 'rectangle', width, height, color })
	}
}

export const isDrawable = (e: Entity) =>
	e.hasComponent(SquareComponent) ||
	e.hasComponent(CircleComponent) ||
	e.hasComponent(RectangleComponent)