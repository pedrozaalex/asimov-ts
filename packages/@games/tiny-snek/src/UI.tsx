import { Match, Switch } from 'solid-js'
import { GameState, onGameRestart } from './entrypoint'

export function UI(props: { points: number; gameState: GameState }) {
	return (
		<div class="ui-root">
			<div class="points">
				<p>score: {props.points.toString().padStart(4, '0')}</p>
			</div>

			<div class="game-state">
				<Switch fallback={<></>}>
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
