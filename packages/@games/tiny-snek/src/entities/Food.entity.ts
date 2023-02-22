import { Entity, IBuildable } from '@asimov/core'
import { CircleComponent, TransformComponent } from '../components'
import { AABBCollider } from '../components/AABBCollider.component'
import {
	BOARD_HEIGHT,
	BOARD_WIDTH,
	onPlayerEatsFood,
	WALL_THICKNESS,
} from '../entrypoint'
import { isMovenentSystem as isMovementSystem } from '../systems/Movement.system'
import { Player } from './Player.entity'

const SIZE = 10

export class Food extends Entity implements IBuildable {
	private minX = WALL_THICKNESS
	private maxX = BOARD_WIDTH - WALL_THICKNESS
	private minY = WALL_THICKNESS
	private maxY = BOARD_HEIGHT - WALL_THICKNESS

	private getRandomX() {
		return (
			Math.floor(Math.random() * (this.maxX - this.minX - SIZE)) + this.minX
		)
	}

	private getRandomY() {
		return (
			Math.floor(Math.random() * (this.maxY - this.minY - SIZE)) + this.minY
		)
	}

	public getInitialComponents() {
		return [
			new TransformComponent(this.getRandomX(), this.getRandomY()),
			new CircleComponent(SIZE, 'red'),
			new AABBCollider({
				width: SIZE * 2,
				height: SIZE * 2,
				onCollision: other => {
					if (other instanceof Player) {
						this.setComponent(
							new TransformComponent(this.getRandomX(), this.getRandomY())
						)
						onPlayerEatsFood()
						const [movementSystem] =
							this.getAllSystems().filter(isMovementSystem)
						movementSystem.increaseSpeed()
					}
				},
			}),
		]
	}
}
