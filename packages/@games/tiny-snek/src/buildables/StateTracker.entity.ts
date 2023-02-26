import { Component, Entity, IBuildable, IComponentValue } from '@asimov/core'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse } from 'fp-ts/lib/Option'
import {
	EventListener,
	GameStateComponent,
	InputListener,
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
			new InputListener({
				' ': () => {
					const previousState = pipe(
						this.getComponentValue(GameStateComponent),
						getOrElse(() => GameState.Running)
					)

					this.setComponent(
						new GameStateComponent(
							previousState === GameState.Running
								? GameState.Paused
								: GameState.Running
						)
					)
				}
			})
		]
	}
}
