import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { Entity, EntityID } from '../entity'
import {
    Component,
    ComponentID,
    IComponentInstance,
    IComponentValue
} from './component'

describe('Component', () => {
	let compValues: Record<ComponentID, Map<EntityID, IComponentValue>> = {}

	const entity = new Entity()
	entity._setComponentStore({
		get: <T extends IComponentValue>(component: IComponentInstance<T>) => {
			return O.fromNullable(compValues[component.id].get(entity.id) as T)
		},

		set: <T extends IComponentValue>(
			component: IComponentInstance<T>,
			value: T
		) => {
			if (!compValues[component.id]) compValues[component.id] = new Map()
			compValues[component.id].set(entity.id, value)
			return E.right(undefined)
		},

		delete: <T extends IComponentValue>(component: IComponentInstance<T>) => {
			compValues[component.id]?.delete(entity.id)
			return E.right(undefined)
		},
	})

	beforeEach(() => {
		compValues = {}
	})

	it('Should return an id from the static property', () => {
		class TestComponent extends Component<string> {}

		expect(TestComponent.id).toBeDefined()
	})

	it('Should have diferent ids for diferent components', () => {
		class TestComponent1 extends Component<string> {}
		class TestComponent2 extends Component<string> {}

		expect(TestComponent1.id).not.toBe(TestComponent2.id)
	})
})
