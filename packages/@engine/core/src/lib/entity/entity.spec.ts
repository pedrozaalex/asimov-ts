import * as O from 'fp-ts/lib/Option'
import { TestComponent, TestComponentStore } from '../fixtures'
import { Entity } from './entity'

describe('Entity', () => {
	let entity: Entity
	let componentStore: TestComponentStore

	beforeEach(() => {
		componentStore = new TestComponentStore()
		entity = new Entity(() => componentStore)
	})

	test('Should be initialized with a unique ID', () => {
		expect(entity.id).toBeDefined()
	})

	test('Should generate a new ID for each new instance', () => {
		const entity2 = new Entity(() => componentStore)
		expect(entity.id).not.toEqual(entity2.id)
	})

	test('Should add a component correctly', () => {
		const component1 = new TestComponent()

		entity.setComponent(component1.id, 'value')

		expect(entity.hasComponent(component1.id)).toBe(true)
		expect(entity.getComponentValue(component1.id)).toEqual(O.some('value'))
	})

	test('Should remove a component correctly', () => {
		const component1 = new TestComponent()

		entity.setComponent(component1.id, 'value')
		expect(entity.hasComponent(component1.id)).toBe(true)

		entity.removeComponent(component1.id)
		expect(entity.hasComponent(component1.id)).toBe(false)
	})

	test('Should add multiple components correctly', () => {
		const c1 = new TestComponent()
		const c2 = new TestComponent()
		const c3 = new TestComponent()

		entity.setComponent(c1.id, 'value1')
		entity.setComponent(c2.id, 'value2')
		entity.setComponent(c3.id, 'value3')

		expect(entity.hasComponent(c1.id)).toBe(true)
		expect(entity.hasComponent(c2.id)).toBe(true)
		expect(entity.hasComponent(c3.id)).toBe(true)

		expect(entity.getComponentValue(c1.id)).toEqual(O.some('value1'))
		expect(entity.getComponentValue(c2.id)).toEqual(O.some('value2'))
		expect(entity.getComponentValue(c3.id)).toEqual(O.some('value3'))
	})
})
