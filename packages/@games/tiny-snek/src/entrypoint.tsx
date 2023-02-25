import { createGame } from '@asimov/core'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { GameState } from './constants'
import { Food, Player } from './entities'
import { StateTracker } from './entities/StateTracker'
import { CollisionSystem } from './systems/Collision.system'
import { EventsSystem } from './systems/Events.system'
import { InputSystem } from './systems/Input.system'
import { MovementSystem } from './systems/Movement.system'
import { RenderingSystem } from './systems/Rendering.system'
import { UIUpdaterSystem } from './systems/UIUpdater.system'
import { UI } from './UI'

function createSnakeGame() {
	return createGame()
		.withEntity(new Player())
		.withEntity(new Food())
		.withEntity(new StateTracker())

		.withSystem(new InputSystem())
		.withSystem(new MovementSystem())
		.withSystem(new CollisionSystem())
		.withSystem(new RenderingSystem())
		.withSystem(new EventsSystem())
		.withSystem(new UIUpdaterSystem())

		.build()
}

let game = createSnakeGame()

game.initialize()

let isPaused = false

window.addEventListener('keydown', e => {
	if (e.key === ' ') {
		game.togglePause()

		if (isPaused) {
			isPaused = false
		} else {
			isPaused = true
		}
	}
})

interface State {
	gameState: GameState
	points: number
}

const [uiState, setUiState] = createSignal<State>({
	gameState: GameState.Running,
	points: 0,
})

export { setUiState as setState }

export const onGameRestart = () => {
	setUiState({ ...uiState(), gameState: GameState.Running, points: 0 })
	game.getCreatedUniverse().destroy()
	game = createSnakeGame()
	game.initialize()
}

const root = document.getElementById('root')

if (root) render(() => <UI {...uiState()} />, root)
