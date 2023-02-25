import { Entity } from '@asimov/core'
import { Match, Switch } from 'solid-js'
import { GameState, onGameRestart } from './entrypoint'

type UIProps = {
	points: number
	gameState: GameState
}

export function mapEntitiesToProps(entities: Entity[]): UIProps {
	return {
		points: 0,
		gameState: GameState.Running,
	}
}

export function UI(props: UIProps) {
	return (
		<div class="ui-root">
			<div class="points">
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
