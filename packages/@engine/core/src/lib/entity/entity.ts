import { Either, right } from 'fp-ts/lib/Either';
import { isSome, none, Option } from 'fp-ts/lib/Option';
import { nanoid } from 'nanoid';
import { ComponentID, IComponentValue } from '../component';

export class EntityID {
  private _classIdentifier = 'EntityID';  

  private _id: string;

  constructor() {
    this._id = nanoid();
  }

  public get value() {
    return this._id;
  }
}

export interface IComponentStore {
  get(componentId: ComponentID): Option<IComponentValue>;
  set(componentId: ComponentID, value: IComponentValue): Either<Error, void>;
  delete(componentId: ComponentID): Either<Error, void>;
}

export class Entity {
  public id: EntityID;
  private componentStore: IComponentStore | undefined;

  constructor(createComponentStore?: (id: EntityID) => IComponentStore) {
    this.id = new EntityID();

    if (createComponentStore) {
      this.componentStore = createComponentStore(this.id);
    }
  }

  public equals(other: Entity): boolean {
    return this.id === other.id;
  }

  public getComponentValue(componentId: ComponentID): Option<IComponentValue> {
    return this.componentStore?.get(componentId) ?? none;
  }

  public setComponent(
    componentId: ComponentID,
    value: IComponentValue
  ): Either<Error, void> {
    if (!this.componentStore) {
      return right(undefined);
    }
    
    return this.componentStore.set(componentId, value);
  }

  public hasComponent(componentId: ComponentID): boolean {
    if (!this.componentStore) {
      return false;
    }
    
    return isSome(this.componentStore.get(componentId));
  }

  public removeComponent(componentId: ComponentID): Either<Error, void> {
    if (!this.componentStore) {
      return right(undefined);
    }
    
    this.componentStore.delete(componentId);
    return right(undefined);
  }
}
