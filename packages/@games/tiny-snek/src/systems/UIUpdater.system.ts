import { Entity, ISystem } from '@asimov/core'
import { setUiState } from '../entrypoint'
import { mapEntitiesToProps } from '../UI'

export class UIUpdaterSystem implements ISystem {
	name = 'UIUpdaterSystem'

	filter() {
		return true
	}

	update(params: { entities: Entity[] }) {
		setUiState(mapEntitiesToProps(params.entities))
	}
}
