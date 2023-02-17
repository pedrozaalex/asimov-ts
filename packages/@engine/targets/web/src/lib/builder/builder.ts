import { Component, Entity, ISystem, SimRunner, Universe } from '@asimov/core'

export interface Game {
	initialize: () => void
	getCurrentUniverse: () => Universe
}

export interface GameBuilder {
	entities: Entity[]
	components: Component[]
	systems: ISystem[]

	withEntity(entity: Entity): GameBuilder
	withComponent(component: Component): GameBuilder
	withSystem(system: ISystem): GameBuilder

	build(): Game
}

export function createGame(): GameBuilder {
	return {
		entities: [],
		components: [],
		systems: [],

		withEntity(entity: Entity) {
			this.entities.push(entity)
			return this
		},

		withComponent(component: Component) {
			this.components.push(component)
			return this
		},

		withSystem(system: ISystem) {
			this.systems.push(system)
			return this
		},

		build() {
			const u = new Universe()

			this.entities.forEach(e => u.addEntity(e))
			this.components.forEach(c => u.addComponent(c))
			this.systems.forEach(s => u.addSystem(s))

			const sim = new SimRunner(u)

			return {
				initialize() {
					sim.begin()
				},
				getCurrentUniverse() {
					return u
				},
			}
		},
	}
}
