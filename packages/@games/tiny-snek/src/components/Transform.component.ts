import { Component } from '@asimov/core'

export class TransformComponent extends Component<{
	x: number
	y: number
	rotation: number
	scale: number
}> {
	constructor(x = 0, y = 0, rotation = 0, scale = 1) {
		super({ x, y, rotation, scale })
	}
}
