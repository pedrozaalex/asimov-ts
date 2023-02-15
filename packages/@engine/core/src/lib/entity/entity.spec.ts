import { BaseComponent, IComponent } from '../component';
import { BaseStore, IStore } from '../store';
import { Entity } from './entity';

describe('Entity', () => {
  let entity: Entity;
  let componentStore: IStore<IComponent>;

  beforeEach(() => {
    componentStore = new BaseStore<IComponent>();
    entity = new Entity(componentStore);
  });

  test('should be initialized with a unique ID', () => {
    expect(entity.id).toBeDefined();
  });

  test('should generate a new ID for each new instance', () => {
    const entity2 = new Entity(componentStore);
    expect(entity.id).not.toEqual(entity2.id);
  });

  test('should add a component correctly', () => {
    const component1 = new BaseComponent<string>('Component1');

    entity.setComponent(component1);

    expect(entity.hasComponent(component1)).toBe(true);
  });

  test('should remove a component correctly', () => {
    const component1 = new BaseComponent<string>('Component1');

    entity.setComponent(component1);
    expect(entity.hasComponent(component1)).toBe(true);

    entity.removeComponent(component1);
    expect(entity.hasComponent(component1)).toBe(false);
  });

  test('should add multiple components correctly', () => {
    const c1 = new BaseComponent<string>('Component1');
    const c2 = new BaseComponent<string>('Component2');
    const c3 = new BaseComponent<string>('Component3');

    entity
      .setComponent(c1)
      .setComponent(c2)
      .setComponent(c3);

    expect(entity.hasComponent(c1)).toBe(true);
    expect(entity.hasComponent(c2)).toBe(true);
    expect(entity.hasComponent(c3)).toBe(true);
  });
});
