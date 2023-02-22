import { Component, IComponentValue } from '../component'
import { Entity } from '../entity'
import { SimRunner } from '../simRunner'
import { ISystem } from '../system'
import { Universe } from '../universe'

export interface Game {
	initialize: () => void
	getCreatedUniverse: () => Universe
	pause: () => void
	resume: () => void
}

export interface IBuildable extends Entity {
	getInitialComponents(): Component<IComponentValue>[]
}

export function isEntityBuildable(entity: Entity): entity is IBuildable {
	return (entity as IBuildable).getInitialComponents !== undefined
}

export interface GameBuilder {
	entities: IBuildable[]
	systems: ISystem[]

	withEntity(entity: IBuildable): GameBuilder
	withEntities(entities: IBuildable[]): GameBuilder
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

		withEntities(entities: IBuildable[]) {
			this.entities = this.entities.concat(entities)
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
				pause() {
					sim.pause()
				},
				resume() {
					sim.resume()
				},
			}
		},
	}
}
