import { Component, IComponentValue } from '../component'
import { Entity } from '../entity'
import { SimRunner } from '../simRunner'
import { ISystem } from '../system'
import { Universe } from '../universe'

export interface Game {
	initialize: () => void
	getCurrentUniverse: () => Universe
}

interface IBuildableEntity extends Entity {
	getComponents(): Component<IComponentValue>[]
}

export interface GameBuilder {
	entities: IBuildableEntity[]
	systems: ISystem[]

	withEntity(entity: IBuildableEntity): GameBuilder
	withSystem(system: ISystem): GameBuilder

	build(): Game
}

export function createGame(): GameBuilder {
	return {
		entities: [],
		systems: [],

		withEntity(entity: IBuildableEntity) {
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
				getCurrentUniverse() {
					return universe
				},
			}
		},
	}
}
