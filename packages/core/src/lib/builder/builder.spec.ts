import { Entity, IBuildable } from '../entity'
import { SimRunner } from '../simRunner'
import { ISystem } from '../system'
import { Universe } from '../universe'
import { createGame, Game } from './builder'

describe('GameBuilder', () => {
	let gameBuilder: ReturnType<typeof createGame>
	const entities: IBuildable[] = []
	const systems: ISystem[] = []

	beforeEach(() => {
		entities.length = 0
		systems.length = 0
		gameBuilder = createGame()
	})

	describe('withBuildable', () => {
		it('should add the entity to the builder', () => {
			const entity = createMockEntity()
			gameBuilder.withBuildable(entity)
			expect(gameBuilder.entities).toContain(entity)
		})

		it('should return the builder for method chaining', () => {
			const result = gameBuilder.withBuildable(createMockEntity())
			expect(result).toBe(gameBuilder)
		})
	})

	describe('withSystem', () => {
		it('should add the system to the builder', () => {
			const system = createMockSystem()
			gameBuilder.withSystem(system)
			expect(gameBuilder.systems).toContain(system)
		})

		it('should return the builder for method chaining', () => {
			const result = gameBuilder.withSystem(createMockSystem())
			expect(result).toBe(gameBuilder)
		})
	})

	describe('build', () => {
		it('should create a universe with the specified entities and systems', () => {
			const entity1 = createMockEntity()
			const entity2 = createMockEntity()
			const system = createMockSystem()

			gameBuilder.withBuildable(entity1).withBuildable(entity2).withSystem(system)

			const game = gameBuilder.build()
			expect(game.getCreatedUniverse().listEntities()).toContain(entity1)
			expect(game.getCreatedUniverse().listEntities()).toContain(entity2)
			expect(game.getCreatedUniverse().listSystems()).toContain(system)
		})

		it('should initialize the sim runner', () => {
			const beginSpy = jest.spyOn(SimRunner.prototype, 'begin')
			gameBuilder.build().initialize()
			expect(beginSpy).toHaveBeenCalled()
		})

		it('should return a game object with the created universe and initialize method', () => {
			const game: Game = gameBuilder.build()
			expect(game.getCreatedUniverse()).toBeInstanceOf(Universe)
			expect(game.initialize).toBeInstanceOf(Function)
		})
	})
})

class TestEntity extends Entity implements IBuildable {
	getInitialComponents = jest.fn(() => [])
}

function createMockEntity(): IBuildable {
	return new TestEntity()
}

function createMockSystem(): ISystem {
	return {
		name: 'test',
		filter: jest.fn(),
		update: jest.fn(),
	}
}
