import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';

export interface IStore<T> {
  get(key: string): O.Option<T>;

  set(key: string, value: T): E.Either<Error, void>;

  remove(key: string): E.Either<Error, void>;
}

export class BaseStore<T> implements IStore<T> {
  private store: Map<string, T>;

  constructor() {
    this.store = new Map();
  }

  public get(key: string): O.Option<T> {
    return O.fromNullable(this.store.get(key) ?? null);
  }

  public set(key: string, value: T): E.Either<Error, void> {
    this.store.set(key, value);
    return E.right(undefined);
  }

  public remove(key: string): E.Either<Error, void> {
    this.store.delete(key);
    return E.right(undefined);
  }
}
