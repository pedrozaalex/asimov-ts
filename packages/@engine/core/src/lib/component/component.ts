import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { nanoid } from 'nanoid';
import { Entity } from '../entity';
import { BaseStore, IStore } from '../store';

export interface IComponent {
  id: string;
  name: string;
}

export class BaseComponent<T> implements IComponent {
  public id: string;
  public name: string;

  private _store: IStore<T>;

  constructor(name: string) {
    this.id = nanoid();
    this.name = name;
    this._store = new BaseStore<T>();
  }

  public getValueForEntity(params: { entityId: Entity['id'] }): O.Option<T> {
    return this._store.get(params.entityId);
  }

  public setValueForEntity(params: {
    entityId: Entity['id'];
    value: T;
  }): E.Either<Error, void> {
    return this._store.set(params.entityId, params.value);
  }

  public removeValueForEntity(params: {
    entityId: Entity['id'];
  }): E.Either<Error, void> {
    return this._store.remove(params.entityId);
  }
}
