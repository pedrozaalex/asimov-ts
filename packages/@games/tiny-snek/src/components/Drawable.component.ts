import { Component, Entity } from '@asimov/core'

interface IDrawable {
	color: string
	zIndex: number
}

interface Square extends IDrawable {
	shape: 'square'
	sideLength: number
}

export class SquareComponent extends Component<Square> {
	constructor(sideLength = 0, color = '', zIndex = 0) {
		super({ shape: 'square', sideLength, color, zIndex })
	}
}

interface Circle extends IDrawable {
	shape: 'circle'
	radius: number
}
export class CircleComponent extends Component<Circle> {
	constructor(radius = 0, color = '', zIndex = 0) {
		super({ shape: 'circle', radius, color, zIndex })
	}
}

interface Rectangle extends IDrawable {
	shape: 'rectangle'
	width: number
	height: number
}

export class RectangleComponent extends Component<Rectangle> {
	constructor(width = 0, height = 0, color = '', zIndex = 0) {
		super({ shape: 'rectangle', width, height, color, zIndex })
	}
}

export const isDrawable = (e: Entity) =>
	e.hasComponent(SquareComponent) ||
	e.hasComponent(CircleComponent) ||
	e.hasComponent(RectangleComponent)
