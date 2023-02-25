import { createGame } from '@asimov/core'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { Food, Player } from './entities'
import { CollisionSystem } from './systems/Collision.system'
import { InputSystem } from './systems/Input.system'
import { MovementSystem } from './systems/Movement.system'
import { RenderingSystem } from './systems/Rendering.system'
import { UI } from './UI'

function createSnakeGame() {
	return createGame()
		.withEntity(new Player())
		.withEntity(new Food())

		.withSystem(new InputSystem())
		.withSystem(new MovementSystem())
		.withSystem(new CollisionSystem())
		.withSystem(new RenderingSystem())

		.build()
}

let game = createSnakeGame()

game.initialize()

let isPaused = false

window.addEventListener('keydown', e => {
	if (e.key === ' ') {
		game.togglePause()

		if (isPaused) {
			onGameResume()
			isPaused = false
		} else {
			onGamePause()
			isPaused = true
		}
	}
})

export enum GameState {
	Running = 'running',
	Paused = 'paused',
	GameOver = 'game-over',
}

interface State {
	gameState: GameState
	points: number
}

const [state, setState] = createSignal<State>({
	gameState: GameState.Running,
	points: 0,
})

export { setState }

export const onPlayerEatsFood = () =>
	setState({ ...state(), points: state().points + 1 })

export const onGamePause = () =>
	setState({ ...state(), gameState: GameState.Paused })

export const onGameResume = () =>
	setState({ ...state(), gameState: GameState.Running })

export const onGameOver = () => {
	setState({ ...state(), gameState: GameState.GameOver })
	game.pause()
}

export const onGameRestart = () => {
	setState({ ...state(), gameState: GameState.Running, points: 0 })
	game.getCreatedUniverse().destroy()
	game = createSnakeGame()
	game.initialize()
}

const root = document.getElementById('root')

if (root) render(() => <UI {...state()} />, root)
