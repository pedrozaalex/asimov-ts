import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { nanoid } from 'nanoid'
import { Entity, EntityID } from '../entity'

export type IComponentValue =
	| string
	| number
	| boolean
	| Array<unknown>
	| Record<string, unknown>

export type ComponentID = string

export interface IEntityStore<ComponentType> {
	get(entityId: EntityID): O.Option<ComponentType>
	set(entityId: EntityID, value: ComponentType): E.Either<Error, void>
	delete(entityId: EntityID): E.Either<Error, void>
}

export interface IComponent<ValueType extends IComponentValue> {
	new (): Component<ValueType>
	__identifier: ComponentID
}

export abstract class Component<ValueType extends IComponentValue> {
	private static _identifier: ComponentID
	public static get __identifier(): ComponentID {
		if (!this._identifier) {
			this._identifier = nanoid()
		}

		return this._identifier
	}

	private entityStore: IEntityStore<ValueType> | undefined

	public constructor() {
		// @ts-expect-error: This is a static property
		this.constructor._identifier = nanoid()
	}

	public get id(): ComponentID {
		// @ts-expect-error: This is a static property
		return this.constructor._identifier
	}

	public getValueForEntity(params: {
		entityId: Entity['id']
	}): O.Option<ValueType> {
		return this.entityStore?.get(params.entityId) ?? O.none
	}

	public setValueForEntity(params: {
		entityId: Entity['id']
		value: ValueType
	}): E.Either<Error, void> {
		if (!this.entityStore) {
			return E.right(undefined)
		}

		return this.entityStore.set(params.entityId, params.value)
	}

	public removeValueForEntity(params: {
		entityId: Entity['id']
	}): E.Either<Error, void> {
		if (!this.entityStore) {
			return E.right(undefined)
		}

		return this.entityStore.delete(params.entityId)
	}

	public _setEntityStore(entityStore: IEntityStore<ValueType>): void {
		this.entityStore = entityStore
	}
}
