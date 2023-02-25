import { Component, Entity, IBuildable, IComponentValue } from '@asimov/core'
import { GameStateComponent, PointsComponent } from '../components'
import { GameState } from '../entrypoint'

export class StateTracker extends Entity implements IBuildable {
	getInitialComponents(): Component<IComponentValue>[] {
		return [new PointsComponent(0), new GameStateComponent(GameState.Running)]
	}
}
