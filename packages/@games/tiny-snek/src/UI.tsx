import { Entity } from '@asimov/core'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse, isSome } from 'fp-ts/lib/Option'
import { Match, Switch } from 'solid-js'
import { GameStateComponent, PointsComponent } from './components'
import { GameState } from './constants'
import { onGameRestart } from './entrypoint'

type UIProps = {
	points: number
	gameState: GameState
}

export function mapEntitiesToProps(entities: Entity[]): UIProps {
	const points = entities
		.filter(e => e.hasComponent(PointsComponent))
		.map(e => e.getComponentValue(PointsComponent))
		.reduce((acc, points) => (isSome(points) ? acc + points.value : acc), 0)

	const [gameState] = entities
		.filter(e => e.hasComponent(GameStateComponent))
		.map(e =>
			pipe(
				e.getComponentValue(GameStateComponent),
				getOrElse(() => GameState.Running)
			)
		)

	return {
		points,
		gameState,
	}
}

export function UI(props: UIProps) {
	return (
		<div class="ui-root">
			<div class="ui-header">
				<p>score: {props.points.toString().padStart(4, '0')}</p>
			</div>

			<div class="game-state">
				<Switch fallback={null}>
					<Match when={props.gameState === GameState.Paused}>
						<span>Paused</span>
					</Match>
					<Match when={props.gameState === GameState.GameOver}>
						<span>Game Over</span>
						<button onClick={onGameRestart}>restart?</button>
					</Match>
				</Switch>
			</div>
		</div>
	)
}
