import { Entity } from '../entity';
import { BaseSystem, ISystem } from './system';

describe('BaseSystem', () => {
  let system: ISystem;

  beforeEach(() => {
    system = new BaseSystem('testSystem');
  });

  it('Should have a name property', () => {
    expect(system.name).toBe('testSystem');
  });

  it('Should return false from the filter method', () => {
    const entity = new Entity();
    expect(system.filter(entity)).toBe(false);
  });

  it('Should do nothing in the update method', () => {
    const deltaTime = 1;
    const entities: Entity[] = [];
    expect(() => system.update({ deltaTime, entities })).not.toThrow();
  });
});
