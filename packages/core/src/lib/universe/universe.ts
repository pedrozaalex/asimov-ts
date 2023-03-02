import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { isEntityBuildable } from '../builder'
import { ComponentID, IComponentInstance, IComponentType, IComponentValue } from '../component'
import { Entity, EntityID, IComponentStore } from '../entity'
import { ISystem } from '../system'

type ComponentEntityValues = Map<EntityID, IComponentValue>

class ComponentStore implements IComponentStore {
	constructor(
		private entityID: EntityID,
		private components: Map<ComponentID, ComponentEntityValues>
	) {}

	public get<T extends IComponentValue>(component: IComponentType<T>): O.Option<T> {
		const value = this.components.get(component.id)?.get(this.entityID) as T

		return O.fromNullable(value)
	}

	public set<T extends IComponentValue>(component: IComponentInstance<T>): E.Either<Error, void> {
		let comp = this.components.get(component.id)

		if (!comp) {
			comp = new Map()
			this.components.set(component.id, comp)
		}

		comp.set(this.entityID, component.value)
		return E.right(undefined)
	}

	public delete<T extends IComponentValue>(component: IComponentType<T>): E.Either<Error, void> {
		const comp = this.components.get(component.id)

		if (!comp) return E.left(new Error(`Component not found`))

		comp.delete(this.entityID)
		return E.right(undefined)
	}
}

class EntityStore {
	constructor(private universe: Universe) {}

	public set(entity: Entity): E.Either<Error, void> {
		this.universe.addEntity(entity)
		return E.right(undefined)
	}

	public delete(entity: Entity): E.Either<Error, void> {
		this.universe.removeEntity(entity)
		return E.right(undefined)
	}
}

export class Universe {
	private _entities = new Array<Entity>()
	private _components = new Map<ComponentID, ComponentEntityValues>()
	private _systems = new Array<ISystem>()

	public addEntity(entity: Entity): void {
		entity._setComponentStore(new ComponentStore(entity.id, this._components))
		entity._setEntityStore(new EntityStore(this))

		if (isEntityBuildable(entity)) entity.getInitialComponents().forEach(entity.setComponent)

		this._entities = [...this._entities, entity]
	}

	public removeEntity(entity: Entity): void {
		this._entities = this._entities.filter(e => !e.equals(entity))
		this._components.forEach(component => component.delete(entity.id))
	}

	public listEntities(): Entity[] {
		return this._entities
	}

	public removeComponent(componentId: ComponentID): void {
		this._components.delete(componentId)
	}

	public addSystem(system: ISystem): void {
		this._systems = [...this._systems, system]
	}

	public listSystems(): ISystem[] {
		return this._systems
	}

	public removeSystem(system: ISystem): void {
		this._systems = this._systems.filter(s => s !== system)
	}

	public update(deltaTime: number): void {
		for (const system of this._systems) {
			const entities = system.filter ? this._entities.filter(system.filter) : this._entities
			system.update({ deltaTime, entities })
		}
	}

	public destroy(): void {
		this._systems = []
		this._components = new Map()
		this._entities = []
	}
}
