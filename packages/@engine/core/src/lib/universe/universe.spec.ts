import * as O from 'fp-ts/lib/Option';
import { ComponentID } from '../component';
import { Entity } from '../entity';
import { TestComponent } from '../fixtures';
import { ISystem } from '../system';
import { Universe } from './Universe';

describe('Universe', () => {
  let universe: Universe;

  beforeEach(() => {
    universe = new Universe();
  });

  describe('addEntity', () => {
    it('Should add an entity to the universe', () => {
      expect(universe.getEntities()).toEqual([]);

      const entity = new Entity();
      universe.addEntity(entity);

      expect(universe.getEntities()).toEqual([entity]);
    });
  });

  describe('removeEntity', () => {
    it('Should remove an entity from the universe', () => {
      const entity = new Entity();
      universe.addEntity(entity);
      universe.removeEntity(entity);
      expect(universe.getEntities()).toEqual([]);
    });
  });

  describe('addComponent', () => {
    it('Should add a component to the universe', () => {
      const component = new TestComponent();
      universe.addComponent(component);
      expect(O.toNullable(universe.getComponent(component.id))).toEqual(
        component
      );
    });
  });

  describe('removeComponent', () => {
    it('Should remove a component from the universe', () => {
      const component = new TestComponent();
      universe.addComponent(component);
      universe.removeComponent(component.id);
      expect(O.toNullable(universe.getComponent(component.id))).toBeNull();
    });
  });

  describe('addSystem', () => {
    it('Should add a system to the universe', () => {
      const system: ISystem = {
        name: 'test',
        filter: () => true,
        update: () => {
          // do nothing
        },
      };
      universe.addSystem(system);
      expect(universe['_systems']).toEqual([system]);
    });
  });

  describe('removeSystem', () => {
    it('Should remove a system from the universe', () => {
      const system: ISystem = {
        name: 'test',
        filter: () => true,
        update: () => {
          // do nothing
        },
      };
      universe.addSystem(system);
      universe.removeSystem(system);
      expect(universe['_systems']).toEqual([]);
    });
  });

  describe('update', () => {
    it('Should update all systems with filtered entities', () => {
      const entity1 = new Entity();
      const entity2 = new Entity();
      universe.addEntity(entity1);
      universe.addEntity(entity2);

      const component = new TestComponent();
      universe.addComponent(component);

      entity1.setComponent(component.id, { value: 1 });
      entity2.setComponent(component.id, { value: 2 });

      const system1: ISystem = {
        name: 'test1',
        filter: (entity) => entity.hasComponent(component.id),
        update: () => {
          // do nothing
        },
      };
      const system2: ISystem = {
        name: 'test2',
        filter: () => true,
        update: () => {
          // do nothing
        },
      };

      universe.addSystem(system1);
      universe.addSystem(system2);

      const system1UpdateSpy = jest.spyOn(system1, 'update');
      const system2UpdateSpy = jest.spyOn(system2, 'update');

      universe.update(1);

      expect(system1UpdateSpy).toHaveBeenCalledWith({
        deltaTime: 1,
        entities: [entity1, entity2],
      });

      expect(system2UpdateSpy).toHaveBeenCalledWith({
        deltaTime: 1,
        entities: [entity1, entity2],
      });
    });
  });

  describe('getComponent', () => {
    it('Should return None when the component is not found', () => {
      const component = universe.getComponent(
        'non-existent-id' as unknown as ComponentID
      );
      expect(O.isNone(component)).toBe(true);
    });
  });

  it('Should update all systems when the universe is updated', () => {
    const deltaTime = 0.1;
    const entity1 = new Entity();
    const entity2 = new Entity();

    const system1: ISystem = {
      name: 'Test System 1',
      filter: () => true,
      update: jest.fn(),
    };

    const system2: ISystem = {
      name: 'Test System 2',
      filter: () => true,
      update: jest.fn(),
    };

    const universe = new Universe();

    universe.addEntity(entity1);
    universe.addEntity(entity2);

    universe.addSystem(system1);
    universe.addSystem(system2);

    universe.update(deltaTime);

    expect(system1.update).toHaveBeenCalledWith({
      deltaTime,
      entities: [entity1, entity2],
    });

    expect(system2.update).toHaveBeenCalledWith({
      deltaTime,
      entities: [entity1, entity2],
    });
  });
});
