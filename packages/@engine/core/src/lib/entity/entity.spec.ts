import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { Component, ComponentID, IComponent, IComponentValue } from '../component'
import { Entity, IComponentStore } from './entity'

class TestComponentStore implements IComponentStore {
	private store: Map<ComponentID, IComponentValue> = new Map()

	public get<T extends IComponentValue>(component: IComponent<T>): O.Option<T> {
		const value = this.store.get(component.id) as T | undefined
		return value !== undefined ? O.some(value) : O.none
	}

	public set<T extends IComponentValue>(
		component: IComponent<T>,
		value: T
	): E.Either<Error, void> {
		this.store.set(component.id, value)
		return E.right(undefined)
	}

	public delete(component: IComponent<IComponentValue>): E.Either<Error, void> {
		this.store.delete(component.id)
		return E.right(undefined)
	}
}

class TestComponent extends Component<string> {
	constructor() {
		super()
	}
}


describe('Entity', () => {
	let entity: Entity
	let componentStore: TestComponentStore

	beforeEach(() => {
		componentStore = new TestComponentStore()
		entity = new Entity()
		entity._setComponentStore(componentStore)
	})

	test('Should be initialized with a unique ID', () => {
		expect(entity).toBeDefined()
	})

	test('Should generate a new ID for each new instance', () => {
		const entity2 = new Entity()
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
