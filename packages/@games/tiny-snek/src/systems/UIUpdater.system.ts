import { Entity, ISystem } from '@asimov/core'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse } from 'fp-ts/lib/Option'
import { GameStateComponent, PointsComponent } from '../components'
import { StateTracker } from '../entities/StateTracker'
import { GameState, setState } from '../entrypoint'

export class UIUpdaterSystem implements ISystem {
	name = 'UIUpdaterSystem'

	filter(e: Entity) {
		return e instanceof StateTracker
	}

	update(params: { entities: Entity[] }) {
		if (params.entities.length === 0) {
			console.error('No StateTracker found in universe')
			return undefined
		}

		if (params.entities.length > 1) {
			console.error('More than one StateTracker found in universe')
			return undefined
		}

		const stateTracker = params.entities[0]

		const gameState = pipe(
			stateTracker.getComponentValue(GameStateComponent),
			getOrElse(() => GameState.Running)
		)
		const points = pipe(
			stateTracker.getComponentValue(PointsComponent),
			getOrElse(() => 0)
		)

		setState({
			points,
			gameState,
		})

		return undefined
	}
}
