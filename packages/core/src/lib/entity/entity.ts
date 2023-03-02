import { Either, left, right } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse, isSome, none, Option, some } from 'fp-ts/lib/Option'
import { nanoid } from 'nanoid'
import { Component, IComponentInstance, IComponentType, IComponentValue } from '../component'

export interface IBuildable extends Entity {
	getInitialComponents(): Component<IComponentValue>[]
}

export function isEntityBuildable(entity: Entity): entity is IBuildable {
	return (entity as IBuildable).getInitialComponents !== undefined
}

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

	set<T extends IComponentValue>(component: IComponentInstance<T>): Either<Error, void>

	delete<T extends IComponentValue>(comp: IComponentType<T>): Either<Error, void>
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
	): Either<Error, void> {
		if (!this.componentStore) {
			return left(
				new Error('No component store set. You need to add this entity to an Universe first.')
			)
		}

		return this.componentStore.set(component)
	}

	public updateComponent<ValueType extends IComponentValue>(
		ComponentType: IComponentType<ValueType>,
		defaultValue: ValueType,
		updater: (previous: ValueType) => ValueType
	): Either<Error, void> {
		if (!this.componentStore) {
			return left(
				new Error('No component store set. You need to add this entity to an Universe first.')
			)
		}

		const previousValue = pipe(
			this.getComponentValue(ComponentType as IComponentType<ValueType>),
			getOrElse(() => defaultValue)
		)

		const newValue = updater(previousValue)

		return this.componentStore.set(new (ComponentType as IComponentType<ValueType>)(newValue))
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
			return left(
				new Error('No component store set. You need to add this entity to an Universe first.')
			)
		}

		this.componentStore.delete(component)
		return right(undefined)
	}

	public addChild(child: IBuildable): Either<Error, void> {
		if (!this.entityStore) {
			return left(
				new Error('No entity store set. You need to add this entity to an Universe first.')
			)
		}

		child._parent = some(this)
		this._children = [...this._children, child]
		this.entityStore.set(child)

		return right(undefined)
	}

	public removeChild(child: Entity): Either<Error, void> {
		if (!this.entityStore) {
			return left(
				new Error('No entity store set. You need to add this entity to an Universe first.')
			)
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
