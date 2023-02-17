import { some } from 'fp-ts/lib/Option'
import { BaseSystem, Component, Entity } from '@asimov/core'
import { createGame, GameBuilder } from './builder'

class TestComponent extends Component {
	public name = 'TestComponent'

	constructor() {
		super()
	}
}

describe('createGame', () => {
	let gameBuilder: GameBuilder

	beforeEach(() => {
		gameBuilder = createGame()
	})

	it('should add entities, components, and systems to the universe', () => {
		const entity = new Entity()
		const component = new TestComponent()
		const system = new BaseSystem('TestSystem')

		const game = gameBuilder
			.withEntity(entity)
			.withComponent(component)
			.withSystem(system)
			.build()

		// Ensure that the entity, component, and system were added to the universe
		expect(game.getCurrentUniverse().getEntities()).toEqual([entity])
		expect(game.getCurrentUniverse().getComponent(component.id)).toEqual(
			some(component)
		)
		expect(game.getCurrentUniverse().listSystems()).toEqual([system])
	})

	it('should begin the simulation when initialize is called', () => {
		const game = gameBuilder.build()
		const uni = game.getCurrentUniverse()

		const beginSpy = jest.spyOn(uni, 'update')

		game.initialize()

		setTimeout(() => expect(beginSpy).toHaveBeenCalled(), 100)
	})
})
