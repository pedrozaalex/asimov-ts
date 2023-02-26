import { Component, Entity, IBuildable, IComponentValue } from '@asimov/core'
import * as KeyCode from 'keycode-js'
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
					this.setComponent(PointsComponent, points => points + 1)
				},
				[GameEvent.OnPlayerDied]: () => {
					this.setComponent(new GameStateComponent(GameState.GameOver))
				},
				[GameEvent.OnGameRestart]: () => {
					this.setComponent(new GameStateComponent(GameState.Running))
					this.setComponent(new PointsComponent(0))
				}
			}),
			new InputListener({
				[KeyCode.VALUE_SPACE]: () => {
					this.setComponent(
						GameStateComponent,
						previousState => {
							if (previousState === GameState.GameOver) return previousState

							return previousState === GameState.Paused
								? GameState.Running
								: GameState.Paused
						},
					)
				},
			}),
		]
	}
}
