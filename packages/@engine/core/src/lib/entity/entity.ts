import { Either, right } from 'fp-ts/lib/Either'
import { isSome, none, Option } from 'fp-ts/lib/Option'
import { nanoid } from 'nanoid'
import { IComponent, IComponentValue } from '../component'

export class EntityID {
	private _classIdentifier = 'EntityID'

	private _id: string

	constructor() {
		this._id = nanoid()
	}

	public get value() {
		return this._id
	}
}

export interface IComponentStore {
	get<T extends IComponentValue>(component: IComponent<T>): Option<T>
	set<T extends IComponentValue>(
		componen: IComponent<T>,
		value: T
	): Either<Error, void>
	delete<T extends IComponentValue>(
		componen: IComponent<T>
	): Either<Error, void>
}

export class Entity {
	public id: EntityID
	private componentStore: IComponentStore | undefined

	constructor() {
		this.id = new EntityID()
	}

	public equals(other: Entity): boolean {
		return this.id === other.id
	}

	public getComponentValue<ValueType extends IComponentValue>(
		component: IComponent<ValueType>
	): Option<ValueType> {
		if (!this.componentStore) return none

		return this.componentStore.get(component)
	}

	public setComponent<ValueType extends IComponentValue>(
		component: IComponent<ValueType>,
		value: ValueType
	): Either<Error, void> {
		if (!this.componentStore) {
			return right(undefined)
		}

		return this.componentStore.set(component, value)
	}

	public hasComponent(component: IComponent<IComponentValue>): boolean {
		if (!this.componentStore) {
			return false
		}

		return isSome(this.componentStore.get(component))
	}

	public removeComponent(
		component: IComponent<IComponentValue>
	): Either<Error, void> {
		if (!this.componentStore) {
			return right(undefined)
		}

		this.componentStore.delete(component)
		return right(undefined)
	}

	public _setComponentStore(componentStore: IComponentStore): void {
		this.componentStore = componentStore
	}
}
