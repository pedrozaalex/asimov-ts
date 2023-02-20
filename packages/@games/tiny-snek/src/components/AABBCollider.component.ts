import { Component, Entity } from '@asimov/core'

export class AABBCollider extends Component<{
	width: number
	height: number
	onCollision: (other: Entity) => void
}> {}
