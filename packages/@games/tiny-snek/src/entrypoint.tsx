import { createGame } from '@asimov/core'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { Food, Player, StateTracker } from './buildables'
import { GameState } from './constants'
import {
	CollisionSystem,
	EventsSystem,
	InputSystem,
	MovementSystem,
	RenderingSystem,
	UIUpdaterSystem,
} from './systems'
import { TrackPlayerSystem } from './systems/TrackPlayer.system'
import { UI } from './UI'

function createSnakeGame() {
	return createGame()
		.withBuildable(new Player())
		.withBuildable(new Food())
		.withBuildable(new StateTracker())

		.withSystem(new InputSystem())
		.withSystem(new MovementSystem())
		.withSystem(new TrackPlayerSystem())
		.withSystem(new CollisionSystem())
		.withSystem(new RenderingSystem())
		.withSystem(new EventsSystem())
		.withSystem(new UIUpdaterSystem())

		.build()
}

let game = createSnakeGame()

game.initialize()

interface State {
	gameState: GameState
	points: number
}

const [uiState, setUiState] = createSignal<State>({
	gameState: GameState.Running,
	points: 0,
})

export { setUiState as setUiState }

export const onGameRestart = () => {
	setUiState({ ...uiState(), gameState: GameState.Running, points: 0 })
	game.getCreatedUniverse().destroy()
	game = createSnakeGame()
	game.initialize()
}

const root = document.getElementById('root')

if (root) render(() => <UI {...uiState()} />, root)
