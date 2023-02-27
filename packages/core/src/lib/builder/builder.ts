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
	togglePause: () => void
	reset: () => void
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

	withBuildable(entity: IBuildable): GameBuilder
	withSystem(system: ISystem): GameBuilder

	build(): Game
}

export function createGame(): GameBuilder {
	return {
		entities: [],
		systems: [],

		withBuildable(entity: IBuildable) {
			this.entities.push(entity)
			return this
		},

		withSystem(system: ISystem) {
			this.systems.push(system)
			return this
		},

		build() {
			const universe = new Universe()

			this.entities.forEach(e => universe.addEntity(e))
			this.systems.forEach(s => universe.addSystem(s))

			const sim = new SimRunner(universe)

			return {
				getCreatedUniverse() {
					return universe
				},
				initialize() {
					sim.begin()
				},
				pause() {
					sim.pause()
				},
				resume() {
					sim.resume()
				},
				togglePause() {
					sim.togglePause()
				},
				reset() {
					universe.destroy()
				},
			}
		},
	}
}
