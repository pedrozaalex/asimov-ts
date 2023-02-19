import { Component, IComponentValue } from '../component'
import { Entity } from '../entity'
import { SimRunner } from '../simRunner'
import { ISystem } from '../system'
import { Universe } from '../universe'

export interface Game {
	initialize: () => void
	getCreatedUniverse: () => Universe
}

export interface IBuildable extends Entity {
	getComponents(): Component<IComponentValue>[]
}

export interface GameBuilder {
	entities: IBuildable[]
	systems: ISystem[]

	withEntity(entity: IBuildable): GameBuilder
	withSystem(system: ISystem): GameBuilder

	build(): Game
}

export function createGame(): GameBuilder {
	return {
		entities: [],
		systems: [],

		withEntity(entity: IBuildable) {
			this.entities.push(entity)
			return this
		},

		withSystem(system: ISystem) {
			this.systems.push(system)
			return this
		},

		build() {
			const universe = new Universe()

			this.entities.forEach(entity => {
				universe.addEntity(entity)
				entity
					.getComponents()
					.forEach(component =>
						universe.setComponentValueForEntity(entity.id, component)
					)
			})
			this.systems.forEach(s => universe.addSystem(s))

			const sim = new SimRunner(universe)

			return {
				initialize() {
					sim.begin()
				},
				getCreatedUniverse() {
					return universe
				},
			}
		},
	}
}
