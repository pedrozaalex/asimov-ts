import { Entity, IBuildable } from '@asimov/core'
import { AABBCollider, HazardComponent, SquareComponent, TransformComponent } from '../components'
import { PLAYER_COLOR, PLAYER_SIZE } from '../constants'

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
			new AABBCollider({
				width: PLAYER_SIZE,
				height: PLAYER_SIZE,
				onCollision: () => undefined,
			}),
			new HazardComponent({ damage: 1 }),
		]
	}

	public moveTo(pos: { x: number; y: number }) {
		this.setComponent(new TransformComponent(pos.x, pos.y))
	}
}
