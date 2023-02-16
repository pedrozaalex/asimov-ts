import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { Component, ComponentID, IComponentValue } from './component';
import { IComponentStore } from './entity';

export class TestComponentStore implements IComponentStore {
  private store: Map<ComponentID, IComponentValue> = new Map();

  public get(componentId: ComponentID): O.Option<IComponentValue> {
    const value = this.store.get(componentId);
    return value !== undefined ? O.some(value) : O.none;
  }

  public set(
    componentId: ComponentID,
    value: IComponentValue
  ): E.Either<Error, void> {
    this.store.set(componentId, value);
    return E.right(undefined);
  }

  public delete(componentId: ComponentID): E.Either<Error, void> {
    this.store.delete(componentId);
    return E.right(undefined);
  }
}

export class TestComponent extends Component {
  public name = 'TestComponent';

  constructor() {
    super();
  }
}
