import { Entity, EntityID, ISystem } from '@asimov-ts/core'
import { toNullable } from 'fp-ts/lib/Option'
import { createStore } from 'solid-js/store'
import { render } from 'solid-js/web'
import { UIBlockComponent } from '../components'

type UpdateArgs = { entities: Entity[]; deltaTime: number }

export class UIUpdaterSystem implements ISystem {
	name = 'UIUpdaterSystem'

	private setters: Map<EntityID, (state: any) => void> = new Map()

	update({ entities }: UpdateArgs) {
		const uiBlocks = entities.filter(e => e.hasComponent(UIBlockComponent))

		uiBlocks.forEach(e => {
			const block = toNullable(e.getComponentValue(UIBlockComponent))

			if (!block) return

			if (!this.setters.has(e.id)) {
				const initialState = block.mapEntitiesToProps(entities)
				const [state, setState] = createStore(initialState as object)

				this.setters.set(e.id, setState)

				render(() => block.render(state), document.body)
			}

			const setState = this.setters.get(e.id)!
			const newState = block.mapEntitiesToProps(entities)

			setState(newState)
		})
	}
}
