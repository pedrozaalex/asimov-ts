import { Entity, ISystem } from '@asimov/core'
import { isNone } from 'fp-ts/lib/Option'
import { VelocityComponent } from '../components/Velocity.component'
import { PLAYER_VELOCITY } from '../entities'

enum PlayerDirection {
	Up,
	Down,
	Left,
	Right,
}

function getDirectionFromVector(axes: { dx: number; dy: number }) {
	if (axes.dx === 0 && axes.dy === 0) return PlayerDirection.Right

	if (Math.abs(axes.dx) > Math.abs(axes.dy)) {
		return axes.dx > 0 ? PlayerDirection.Right : PlayerDirection.Left
	} else {
		return axes.dy > 0 ? PlayerDirection.Down : PlayerDirection.Up
	}
}

export class InputSystem implements ISystem {
	name = 'InputSystem'

	private pressedKeys = new Array<string>()

	private handleKeyDown = (e: KeyboardEvent) => {
		console.log('handleKeyDown', e.key)

		this.pressedKeys.push(e.key)
	}

	constructor() {
		window.addEventListener('keydown', this.handleKeyDown)
	}

	filter = (e: Entity) => e.hasComponent(VelocityComponent)

	update(params: { entities: Entity[] }) {
		if (this.pressedKeys.length === 0) return

		const pressedKey = this.pressedKeys.shift()
		const [player] = params.entities
		const velocity = player.getComponentValue(VelocityComponent)
		if (isNone(velocity)) return
		const direction = getDirectionFromVector(velocity.value)

		let newVelocity

		if (pressedKey === 'ArrowUp') {
			if (direction === PlayerDirection.Down) return
			newVelocity = { dx: 0, dy: -1 }
		}

		if (pressedKey === 'ArrowDown') {
			if (direction === PlayerDirection.Up) return
			newVelocity = { dx: 0, dy: 1 }
		}

		if (pressedKey === 'ArrowLeft') {
			if (direction === PlayerDirection.Right) return
			newVelocity = { dx: -1, dy: 0 }
		}

		if (pressedKey === 'ArrowRight') {
			if (direction === PlayerDirection.Left) return
			newVelocity = { dx: 1, dy: 0 }
		}

		if (!newVelocity) return

    const magnitude = Math.sqrt(newVelocity.dx ** 2 + newVelocity.dy ** 2)
    newVelocity.dx = (newVelocity.dx / magnitude) * PLAYER_VELOCITY
    newVelocity.dy = (newVelocity.dy / magnitude) * PLAYER_VELOCITY
		player.setComponent(new VelocityComponent(newVelocity.dx, newVelocity.dy))
	}
}
