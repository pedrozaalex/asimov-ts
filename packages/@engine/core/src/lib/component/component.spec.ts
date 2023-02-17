import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Entity, EntityID } from '../entity'
import { TestComponent } from '../fixtures'
import { ComponentID, IComponent, IComponentValue } from './component'

describe('Component', () => {
	let compValues: Record<ComponentID, Map<EntityID, IComponentValue>> = {}

	const entity = new Entity(id => {
		const get = <T extends IComponentValue>(component: IComponent<T>) =>
			O.fromNullable(compValues[component.__identifier]?.get(id) as T)

		const set = <T extends IComponentValue>(
			component: IComponent<T>,
			value: T
		) => {
			if (!compValues[component.__identifier]) {
				compValues[component.__identifier] = new Map()
			}

			compValues[component.__identifier].set(id, value)
			return E.right(undefined)
		}

		const delete_ = <T extends IComponentValue>(component: IComponent<T>) => {
			compValues[component.__identifier]?.delete(id)
			return E.right(undefined)
		}

		return {
			get,
			set,
			delete: delete_,
		}
	})

	const component = new TestComponent()
	component._setEntityStore({
		get: entityId =>
			O.fromNullable(compValues[component.id].get(entityId) as string),
		set: (entityId, value) => {
			if (!compValues[component.id]) {
				compValues[component.id] = new Map()
			}

			compValues[component.id].set(entityId, value)
			return E.right(undefined)
		},
		delete: entityId => {
			compValues[component.id]?.delete(entityId)
			return E.right(undefined)
		},
	})

	beforeEach(() => {
		compValues = {}
	})

	it('Should set and get a value for an entity correctly', () => {
		// Set a value for the entity
		const setValueResult = component.setValueForEntity({
			entityId: entity.id,
			value: 'hello',
		})

		expect(E.isRight(setValueResult)).toBe(true)
		expect(entity.hasComponent(TestComponent)).toBe(true)
		expect(component.getValueForEntity({ entityId: entity.id })).toEqual(
			O.some('hello')
		)

		// Get the value for the entity
		const getValueResult = component.getValueForEntity({ entityId: entity.id })
		expect(O.isSome(getValueResult)).toBe(true)
		expect(
			pipe(
				getValueResult,
				O.getOrElseW(() => '')
			)
		).toEqual('hello')
	})

	it('Should remove a value for an entity correctly', () => {
		const entityId = entity.id

		// Set a value for the entity
		const setValueResult = component.setValueForEntity({
			entityId,
			value: 'hello',
		})
		expect(E.isRight(setValueResult)).toBe(true)

		// Remove the value for the entity
		const removeValueResult = component.removeValueForEntity({ entityId })
		expect(E.isRight(removeValueResult)).toBe(true)

		// Check that the value was removed
		const getValueResult = component.getValueForEntity({ entityId })
		expect(O.isNone(getValueResult)).toBe(true)
	})
})
