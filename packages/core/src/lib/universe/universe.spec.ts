import * as O from 'fp-ts/lib/Option'
import { Component } from '../component'
import { Entity } from '../entity'
import { ISystem } from '../system'
import { Universe } from './universe'

class TestComponent extends Component<string> {}

describe('Universe', () => {
	let universe: Universe

	beforeEach(() => {
		universe = new Universe()
	})

	describe('addEntity', () => {
		it('Should add an entity to the universe', () => {
			expect(universe.listEntities()).toEqual([])

			const entity = new Entity()
			universe.addEntity(entity)

			expect(universe.listEntities()).toEqual([entity])
		})
	})

	describe('removeEntity', () => {
		it('Should remove an entity from the universe', () => {
			const entity = new Entity()
			universe.addEntity(entity)
			universe.removeEntity(entity)
			expect(universe.listEntities()).toEqual([])
		})
	})

	describe('removeComponent', () => {
		it('Should remove a component from the universe', () => {
			const component = new TestComponent('test')
			universe['_components'].set(component.id, new Map())
			universe.removeComponent(component.id)
			expect(universe['_components'].get(component.id)).toBeFalsy()
		})
	})

	describe('addSystem', () => {
		it('Should add a system to the universe', () => {
			const system: ISystem = {
				name: 'test',
				filter: () => true,
				update: () => undefined,
			}
			universe.addSystem(system)
			expect(universe['_systems']).toEqual([system])
		})
	})

	describe('removeSystem', () => {
		it('Should remove a system from the universe', () => {
			const system: ISystem = {
				name: 'test',
				filter: () => true,
				update: () => undefined,
			}
			universe.addSystem(system)
			universe.removeSystem(system)
			expect(universe['_systems']).toEqual([])
		})
	})

	describe('update', () => {
		it('Should update all systems with filtered entities', () => {
			// Entities
			const entity1 = new Entity()
			const entity2 = new Entity()
			universe.addEntity(entity1)
			universe.addEntity(entity2)

			// Components
			entity1.setComponent(new TestComponent('test1'))
			entity2.setComponent(new TestComponent('test2'))

			// Systems
			const system1: ISystem = {
				name: 'test1',
				filter: (entity): boolean =>
					O.toNullable(entity.getComponentValue(TestComponent)) === 'test1',
				update: () => undefined,
			}
			const system2: ISystem = {
				name: 'test2',
				filter: () => true,
				update: () => undefined,
			}
			universe.addSystem(system1)
			universe.addSystem(system2)

			const system1UpdateSpy = jest.spyOn(system1, 'update')
			const system2UpdateSpy = jest.spyOn(system2, 'update')

			// run 100 upate calls
			for (let i = 0; i < 100; i++) {
				universe.update(0.1)
			}

			expect(system1UpdateSpy).toHaveBeenCalledTimes(100)
			expect(system2UpdateSpy).toHaveBeenCalledTimes(100)
			system1UpdateSpy.mock.calls.forEach(call => expect(call[0].entities).toEqual([entity1]))
			system2UpdateSpy.mock.calls.forEach(call =>
				expect(call[0].entities).toEqual([entity1, entity2])
			)
		})
	})

	it('Should update all systems when the universe is updated', () => {
		const deltaTime = 0.1
		const entity1 = new Entity()
		const entity2 = new Entity()

		const system1: ISystem = {
			name: 'Test System 1',
			filter: () => true,
			update: jest.fn(),
		}

		const system2: ISystem = {
			name: 'Test System 2',
			filter: () => true,
			update: jest.fn(),
		}

		const universe = new Universe()

		universe.addEntity(entity1)
		universe.addEntity(entity2)

		universe.addSystem(system1)
		universe.addSystem(system2)

		universe.update(deltaTime)

		expect(system1.update).toHaveBeenCalledWith({
			deltaTime,
			entities: [entity1, entity2],
		})

		expect(system2.update).toHaveBeenCalledWith({
			deltaTime,
			entities: [entity1, entity2],
		})
	})
})
