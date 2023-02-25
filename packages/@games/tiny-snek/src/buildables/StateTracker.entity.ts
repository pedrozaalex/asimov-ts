import { Component, Entity, IBuildable, IComponentValue } from '@asimov/core'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse } from 'fp-ts/lib/Option'
import {
	EventListener,
	GameStateComponent,
	PointsComponent,
} from '../components'
import { GameState } from '../constants'
import { GameEvent } from '../systems'

export class StateTracker extends Entity implements IBuildable {
	getInitialComponents(): Component<IComponentValue>[] {
		return [
			new PointsComponent(0),
			new GameStateComponent(GameState.Running),
			new EventListener({
				[GameEvent.OnPlayerAteFood]: () => {
					const previousPoints = pipe(
						this.getComponentValue(PointsComponent),
						getOrElse(() => 0)
					)

					this.setComponent(new PointsComponent(previousPoints + 1))
				},
			}),
		]
	}
}
