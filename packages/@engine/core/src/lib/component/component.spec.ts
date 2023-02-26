import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { Entity, EntityID, IComponentStore } from '../entity'
import {
	Component,
	ComponentID,
	IComponentType,
	IComponentValue,
} from './component'

describe('Component', () => {
	let compValues: Record<ComponentID, Map<EntityID, IComponentValue>> = {}

	const entity = new Entity()
	entity._setComponentStore({
		get<T extends IComponentValue>(ComponentType: IComponentType<T>) {
			return O.fromNullable(
				compValues[ComponentType.id].get(entity.id) as T | undefined
			)
		},

		set(component) {
			if (!compValues[component.id]) compValues[component.id] = new Map()
			compValues[component.id].set(entity.id, component.value)
			return E.right(undefined)
		},

		delete(ComponentType) {
			compValues[ComponentType.id]?.delete(entity.id)
			return E.right(undefined)
		},
	} satisfies IComponentStore)

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
