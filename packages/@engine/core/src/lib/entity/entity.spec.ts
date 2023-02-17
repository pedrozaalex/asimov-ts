import * as O from 'fp-ts/lib/Option'
import { Component } from '../component'
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
		expect(entity).toBeDefined()
	})

	test('Should generate a new ID for each new instance', () => {
		const entity2 = new Entity(() => componentStore)
		expect(entity).not.toEqual(entity2)
	})

	test('Should add a component correctly', () => {
		entity.setComponent(TestComponent, 'value')

		expect(entity.hasComponent(TestComponent)).toBe(true)
		expect(entity.getComponentValue(TestComponent)).toEqual(O.some('value'))
	})

	test('Should remove a component correctly', () => {
		entity.setComponent(TestComponent, 'value')
		expect(entity.hasComponent(TestComponent)).toBe(true)

		entity.removeComponent(TestComponent)
		expect(entity.hasComponent(TestComponent)).toBe(false)
	})

	test('Should add multiple components correctly', () => {
		class TC1 extends Component<never> {}
		class TC2 extends Component<never> {}
		class TC3 extends Component<never> {}

		entity.setComponent(TC1, 'value1')
		entity.setComponent(TC2, 'value2')
		entity.setComponent(TC3, 'value3')

		expect(entity.hasComponent(TC1)).toBe(true)
		expect(entity.hasComponent(TC2)).toBe(true)
		expect(entity.hasComponent(TC3)).toBe(true)

		expect(entity.getComponentValue(TC1)).toEqual(O.some('value1'))
		expect(entity.getComponentValue(TC2)).toEqual(O.some('value2'))
		expect(entity.getComponentValue(TC3)).toEqual(O.some('value3'))
	})
})
