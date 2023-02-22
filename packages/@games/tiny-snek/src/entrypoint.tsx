import { render } from 'solid-js/web'
import { createGame } from '@asimov/core'
import { Food, Player, Wall } from './entities'
import { CollisionSystem } from './systems/Collision.system'
import { InputSystem } from './systems/Input.system'
import { MovementSystem } from './systems/Movement.system'
import { RenderingSystem } from './systems/Rendering.system'
import { UI } from './UI'
import { createSignal } from 'solid-js'

export const BOARD_WIDTH = 500
export const BOARD_HEIGHT = 500
export const WALL_THICKNESS = 10
export const HORIZONTAL_SQUARE_COUNT = 25
export const VERTICAL_SQUARE_COUNT = HORIZONTAL_SQUARE_COUNT
export const PLAYABLE_AREA_WIDTH = BOARD_WIDTH - WALL_THICKNESS * 2
export const PLAYABLE_AREA_HEIGHT = BOARD_HEIGHT - WALL_THICKNESS * 2
export const SQUARE_WIDTH = PLAYABLE_AREA_WIDTH / HORIZONTAL_SQUARE_COUNT
export const SQUARE_HEIGHT = PLAYABLE_AREA_HEIGHT / VERTICAL_SQUARE_COUNT

function createSnakeGame() {
	return createGame()
		.withEntity(new Player())
		.withEntity(new Food())
		.withEntities([
			new Wall(0, 0, WALL_THICKNESS, BOARD_HEIGHT),
			new Wall(0, 0, BOARD_WIDTH, WALL_THICKNESS),
			new Wall(BOARD_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, BOARD_HEIGHT),
			new Wall(0, BOARD_HEIGHT - WALL_THICKNESS, BOARD_WIDTH, WALL_THICKNESS),
		])

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

export const onPlayerEatsFood = () => {
	setState({ ...state(), points: state().points + 1 })
}

export const onGamePause = () => {
	setState({ ...state(), gameState: GameState.Paused })
}

export const onGameResume = () => {
	setState({ ...state(), gameState: GameState.Running })
}

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
