import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { Component, ComponentID, IComponentValue } from '../component';
import { Entity, EntityID } from '../entity';
import { ISystem } from '../system';

export class Universe {
  private _entities: Entity[] = [];
  private _components: Map<ComponentID, Component> = new Map();
  private _systems: ISystem[] = [];

  private createComponentStoreForEntity = (entityId: EntityID) => ({
    get: (componentId: ComponentID) => {
      const comp = this.getComponent(componentId);

      if (O.isNone(comp)) {
        return comp;
      }

      return comp.value.getValueForEntity({ entityId });
    },
    set: (componentId: ComponentID, value: IComponentValue) => {
      const comp = this.getComponent(componentId);

      if (O.isNone(comp)) {
        return E.left(
          new Error(`Component ${componentId} does not exist in this universe`)
        );
      }

      return comp.value.setValueForEntity({ entityId, value });
    },
    delete: (componentId: ComponentID) => {
      const comp = this.getComponent(componentId);

      if (O.isNone(comp)) {
        return E.left(
          new Error(`Component ${componentId} does not exist in this universe`)
        );
      }

      return comp.value.removeValueForEntity({ entityId });
    },
  });

  public addEntity(entity: Entity): void {
    entity._setComponentStore(this.createComponentStoreForEntity(entity.id));

    this._entities.push(entity);
  }

  public removeEntity(entity: Entity): void {
    const idx = this._entities.findIndex((e) => e.id === entity.id);

    if (idx !== -1) {
      this._entities.splice(idx, 1);
    }

    this._components.forEach((component) => {
      component.removeValueForEntity({ entityId: entity.id });
    });
  }

  public getEntities(): Entity[] {
    return this._entities;
  }

  public addComponent(component: Component): void {
    this._components.set(component.id, component);
  }

  public getComponent(componentId: ComponentID): O.Option<Component> {
    const component = this._components.get(componentId);
    return O.fromNullable(component);
  }

  public removeComponent(componentId: ComponentID): void {
    this._components.delete(componentId);
  }

  public addSystem(system: ISystem): void {
    this._systems.push(system);
  }

  public removeSystem(system: ISystem): void {
    const idx = this._systems.findIndex((s) => s === system);
    if (idx !== -1) {
      this._systems.splice(idx, 1);
    }
  }

  public update(deltaTime: number): void {
    for (const system of this._systems) {
      const entities = this._entities.filter(system.filter);
      system.update({ deltaTime, entities });
    }
  }
}
