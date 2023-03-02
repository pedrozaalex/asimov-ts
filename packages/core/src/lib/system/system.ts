import { Entity } from '../entity'

export interface ISystem {
	name: string
	filter?: (entity: Entity) => boolean
	update: (params: { deltaTime: number; entities: Entity[] }) => void
}

export class BaseSystem implements ISystem {
	public name: string

	constructor(name: string) {
		this.name = name
	}

	filter(): boolean {
		return false
	}

	public update(): void {
		// do nothing
	}
}
