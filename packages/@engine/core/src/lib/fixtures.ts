import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { Component, ComponentID, IComponent, IComponentValue, IEntityStore } from './component'
import { EntityID, IComponentStore } from './entity'

export class TestComponentStore implements IComponentStore {
	private store: Map<ComponentID, IComponentValue> = new Map()

	public get<T extends IComponentValue>(component: IComponent<T>): O.Option<T> {
		const value = this.store.get(component.__identifier) as T | undefined
		return value !== undefined ? O.some(value) : O.none
	}

	public set<T extends IComponentValue>(
		component: IComponent<T>,
		value: T
	): E.Either<Error, void> {
		this.store.set(component.__identifier, value)
		return E.right(undefined)
	}

	public delete(component: IComponent<IComponentValue>): E.Either<Error, void> {
		this.store.delete(component.__identifier)
		return E.right(undefined)
	}
}

export class TestEntityStore implements IEntityStore<string> {
	private store: Map<EntityID, string> = new Map()

	public get(entityId: EntityID): O.Option<string> {
		return O.fromNullable(this.store.get(entityId))
	}

	public set(entityId: EntityID, value: string): E.Either<Error, void> {
		this.store.set(entityId, value)
		return E.right(undefined)
	}

	public delete(entityId: EntityID): E.Either<Error, void> {
		this.store.delete(entityId)
		return E.right(undefined)
	}
}

export class TestComponent extends Component<string> {
	constructor() {
		super()
	}
}
