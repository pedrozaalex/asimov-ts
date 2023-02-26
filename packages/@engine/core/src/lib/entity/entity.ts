import { Either, left, right } from 'fp-ts/lib/Either'
import { isNone, isSome, none, Option, some } from 'fp-ts/lib/Option'
import { nanoid } from 'nanoid'
import { IBuildable } from '../builder'
import {
	IComponentInstance,
	IComponentType,
	IComponentValue,
} from '../component'

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
	get<T extends IComponentValue>(component: IComponentType<T>): Option<T>
	set<T extends IComponentValue>(
		component: IComponentInstance<T>
	): Either<Error, void>
	delete<T extends IComponentValue>(
		comp: IComponentType<T>
	): Either<Error, void>
}

export interface IEntityStore {
	set(entity: Entity): Either<Error, void>
	delete(entity: Entity): Either<Error, void>
}

export class Entity {
	public id: EntityID
	private componentStore: IComponentStore | undefined
	private entityStore: IEntityStore | undefined
	private _parent: Option<Entity> = none

	public get parent() {
		return this._parent
	}
	private _children: Entity[] = []

	public get children() {
		return this._children
	}

	constructor() {
		this.id = new EntityID()
	}

	public equals(other: Entity): boolean {
		return this.id.value === other.id.value
	}

	public getComponentValue<ValueType extends IComponentValue>(
		component: IComponentType<ValueType>
	): Option<ValueType> {
		if (!this.componentStore) return none

		return this.componentStore.get(component)
	}

	public setComponent<ValueType extends IComponentValue>(
		component: IComponentInstance<ValueType>
	): Either<Error, void>

	public setComponent<ValueType extends IComponentValue>(
		ComponentType: IComponentType<ValueType>,
		updater: (previous: ValueType) => ValueType
	): Either<Error, void>

	public setComponent<ValueType extends IComponentValue>(
		ComponentType: IComponentType<ValueType> | IComponentInstance<ValueType>,
		updater?: (previous: ValueType) => ValueType
	): Either<Error, void> {
		if (!this.componentStore) {
			return right(undefined)
		}

		if (updater === undefined) {
			return this.componentStore.set(
				ComponentType as IComponentInstance<ValueType>
			)
		}

		const previousValue = this.getComponentValue(
			ComponentType as IComponentType<ValueType>
		)

		if (isNone(previousValue)) {
			return left(new Error('Cannot update a component that does not exist'))
		}

		const newValue = updater(previousValue.value)

		return this.componentStore.set(
			new (ComponentType as IComponentType<ValueType>)(newValue)
		)
	}

	public hasComponent(component: IComponentType<IComponentValue>): boolean {
		if (!this.componentStore) {
			return false
		}

		return isSome(this.componentStore.get(component))
	}

	public removeComponent<ValueType extends IComponentValue>(
		component: IComponentType<ValueType>
	): Either<Error, void> {
		if (!this.componentStore) {
			return right(undefined)
		}

		this.componentStore.delete(component)
		return right(undefined)
	}

	public addChild(child: IBuildable): Either<Error, void> {
		if (!this.entityStore) {
			return right(undefined)
		}

		this._children.push(child)
		child._parent = some(this)
		this.entityStore.set(child)

		return right(undefined)
	}

	public removeChild(child: Entity): Either<Error, void> {
		if (!this.entityStore) {
			return right(undefined)
		}

		this._children = this._children.filter(other => !other.equals(child))
		child._parent = none
		return this.entityStore.delete(child)
	}

	public _setEntityStore(entityStore: IEntityStore): void {
		this.entityStore = entityStore
	}

	public _setComponentStore(componentStore: IComponentStore): void {
		this.componentStore = componentStore
	}
}
