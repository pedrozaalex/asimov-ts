import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { Entity } from '../entity';
import { TestComponent, TestComponentStore } from '../fixtures';

describe('BaseComponent', () => {
  let entity: Entity;

  // Create a component with a store for string values
  const component = new TestComponent();

  beforeEach(() => {
    entity = new Entity(() => new TestComponentStore());
  });

  it('Should set and get a value for an entity correctly', () => {
    // Set a value for the entity
    const setValueResult = component.setValueForEntity({
      entityId: entity.id,
      value: 'hello',
    });
    expect(E.isRight(setValueResult)).toBe(true);

    // Get the value for the entity
    const getValueResult = component.getValueForEntity({ entityId: entity.id });
    expect(O.isSome(getValueResult)).toBe(true);
    expect(
      pipe(
        getValueResult,
        O.getOrElseW(() => '')
      )
    ).toEqual('hello');
  });

  it('Should remove a value for an entity correctly', () => {
    const entityId = entity.id;

    // Set a value for the entity
    const setValueResult = component.setValueForEntity({
      entityId,
      value: 'hello',
    });
    expect(E.isRight(setValueResult)).toBe(true);

    // Remove the value for the entity
    const removeValueResult = component.removeValueForEntity({ entityId });
    expect(E.isRight(removeValueResult)).toBe(true);

    // Check that the value was removed
    const getValueResult = component.getValueForEntity({ entityId });
    expect(O.isNone(getValueResult)).toBe(true);
  });
});
