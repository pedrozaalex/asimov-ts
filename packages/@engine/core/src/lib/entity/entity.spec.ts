import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import {
	Component,
	ComponentID,
	IComponentInstance,
	IComponentType,
	IComponentValue,
} from '../component'
import { Entity, IComponentStore } from './entity'

class TestComponentStore implements IComponentStore {
	private store: Map<ComponentID, IComponentValue> = new Map()

	public get<T extends IComponentValue>(
		component: IComponentType<T>
	): O.Option<T> {
		const value = this.store.get(component.id) as T | undefined
		return value !== undefined ? O.some(value) : O.none
	}

	public set<T extends IComponentValue>(
		component: IComponentInstance<T>
	): E.Either<Error, void> {
		this.store.set(component.id, component.value)
		return E.right(undefined)
	}

	public delete<T extends IComponentValue>(
		component: IComponentType<T>
	): E.Either<Error, void> {
		this.store.delete(component.id)
		return E.right(undefined)
	}
}

class TestComponent extends Component<string> {
	constructor(value: string) {
		super(value)
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

	test('Should add and get a component correctly', () => {
		entity.setComponent(new TestComponent('value'))

		const value = entity.getComponentValue(TestComponent)
		expect(value).toEqual(O.some('value'))
	})

	test('Should remove a component correctly', () => {
		entity.setComponent(new TestComponent('value'))
		entity.removeComponent(TestComponent)

		expect(entity.getComponentValue(TestComponent)).toEqual(O.none)
	})

	test('Should add multiple components correctly', () => {
		class TC1 extends Component<string> {}
		class TC2 extends Component<string> {}
		class TC3 extends Component<string> {}

		entity.setComponent(new TC1('value1'))
		entity.setComponent(new TC2('value2'))
		entity.setComponent(new TC3('value3'))

		expect(entity.getComponentValue(TC1)).toEqual(O.some('value1'))
		expect(entity.getComponentValue(TC2)).toEqual(O.some('value2'))
		expect(entity.getComponentValue(TC3)).toEqual(O.some('value3'))
	})
})
