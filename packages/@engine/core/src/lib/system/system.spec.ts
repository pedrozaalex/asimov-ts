import { IComponent } from '../component';
import { Entity } from '../entity';
import { BaseStore } from '../store';
import { BaseSystem, ISystem } from './system';

describe('BaseSystem', () => {
  let system: ISystem;

  beforeEach(() => {
    system = new BaseSystem('testSystem');
  });

  it('should have a name property', () => {
    expect(system.name).toBe('testSystem');
  });

  it('should return false from the filter method', () => {
    const entity = new Entity(new BaseStore<IComponent>());
    expect(system.filter(entity)).toBe(false);
  });

  it('should do nothing in the update method', () => {
    const deltaTime = 1;
    const entities: Entity[] = [];
    expect(() => system.update({ deltaTime, entities })).not.toThrow();
  });
});