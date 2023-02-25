import { Entity, ISystem } from '@asimov/core'
import { toNullable } from 'fp-ts/lib/Option'
import { InputListener } from '../components'

export class InputSystem implements ISystem {
	name = 'InputSystem'

	private pressedKeys = new Set<string>()

	private handleKeyDown = (e: KeyboardEvent) => this.pressedKeys.add(e.key)

	private handleKeyUp = (e: KeyboardEvent) => this.pressedKeys.delete(e.key)

	constructor() {
		window.addEventListener('keydown', this.handleKeyDown)
		window.addEventListener('keyup', this.handleKeyUp)
	}

	filter(e: Entity) {
		return e.hasComponent(InputListener)
	}

	update(params: { entities: Entity[] }) {
		if (params.entities.length === 0) return

		const pressedKeys = Array.from(this.pressedKeys)
		if (pressedKeys.length === 0) return

		pressedKeys.forEach(pressedKey => {
			params.entities.forEach(entity => {
				const inputListener = toNullable(
					entity.getComponentValue(InputListener)
				)
				if (!inputListener) return

				const handler = inputListener[pressedKey]
				if (handler === undefined) return

				handler()
			})
		})
	}
}
