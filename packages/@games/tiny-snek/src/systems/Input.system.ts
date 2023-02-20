import { Entity, ISystem } from '@asimov/core'
import { isNone } from 'fp-ts/lib/Option'
import { InputListener } from '../components/InputListener.component'

export class InputSystem implements ISystem {
	name = 'InputSystem'

	private pressedKeys = new Array<string>()

	private handleKeyDown = (e: KeyboardEvent) => this.pressedKeys.push(e.key)

	constructor() {
		window.addEventListener('keydown', this.handleKeyDown)
	}

	filter(e: Entity) {
		return e.hasComponent(InputListener)
	}

	update(params: { entities: Entity[] }) {
		if (this.pressedKeys.length === 0) return
		if (params.entities.length === 0) return

		const pressedKey = this.pressedKeys.shift()
		if (pressedKey === undefined) return

		params.entities.forEach(entity => {
			const inputListener = entity.getComponentValue(InputListener)
			if (isNone(inputListener)) return

			const handler = inputListener.value[pressedKey]
			if (handler === undefined) return

			handler()
		})
	}
}
