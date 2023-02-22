import { Entity, IBuildable } from '@asimov/core'
import { SquareComponent, TransformComponent } from '../components'
import { AABBCollider } from '../components/AABBCollider.component'
import { HazardComponent } from '../components/Hazard.component'
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
			new AABBCollider({
				width: PLAYER_SIZE,
				height: PLAYER_SIZE,
				onCollision: other => {
					console.log('Tail segment collided with', other)
				},
			}),
			new HazardComponent({ damage: 1 }),
		]
	}

	public moveTo(pos: { x: number; y: number }) {
		this.setComponent(new TransformComponent(pos.x, pos.y))
	}
}
