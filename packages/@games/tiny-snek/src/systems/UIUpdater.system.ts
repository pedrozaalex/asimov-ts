import { Entity, ISystem } from '@asimov/core'
import { setState } from '../entrypoint'
import { mapEntitiesToProps } from '../UI'

export class UIUpdaterSystem implements ISystem {
	name = 'UIUpdaterSystem'

	filter() {
		return true
	}

	update(params: { entities: Entity[] }) {
		setState(mapEntitiesToProps(params.entities))
	}
}
