import { Entity, IBuildable } from '@asimov/core'
import { SquareComponent, TransformComponent } from '../components'
import { PLAYER_COLOR, PLAYER_SIZE } from './Player.entity'

export class TailSegment extends Entity implements IBuildable {
	private initialX: number
	private initialY: number

	constructor(pos: { x: number; y: number }) {
		super()

		this.initialX = pos.x
		this.initialY = pos.y
	}

	public getInitialComponents() {
		return [
			new TransformComponent(this.initialX, this.initialY),
			new SquareComponent(PLAYER_SIZE, PLAYER_COLOR),
		]
	}

	public moveTo(pos: { x: number; y: number }) {
		this.setComponent(new TransformComponent(pos.x, pos.y))
	}
}
