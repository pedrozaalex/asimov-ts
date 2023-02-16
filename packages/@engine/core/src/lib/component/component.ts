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

export interface IComponent {
	id: ComponentID
	name: string
}

export class ComponentID {
	private _classIdentifier = 'ComponentID'

	private _id: string

	constructor() {
		this._id = nanoid()
	}

	public get value() {
		return this._id
	}
}

export abstract class Component implements IComponent {
	public abstract name: string
	public id: ComponentID

	private values: Map<EntityID, IComponentValue>

	public constructor() {
		this.id = new ComponentID()
		this.values = new Map()
	}

	public getValueForEntity(params: {
		entityId: Entity['id']
	}): O.Option<IComponentValue> {
		return O.fromNullable(this.values.get(params.entityId))
	}

	public setValueForEntity(params: {
		entityId: Entity['id']
		value: IComponentValue
	}): E.Either<Error, void> {
		this.values.set(params.entityId, params.value)
		return E.right(undefined)
	}

	public removeValueForEntity(params: {
		entityId: Entity['id']
	}): E.Either<Error, void> {
		this.values.delete(params.entityId)
		return E.right(undefined)
	}
}
