export const BOARD_WIDTH = 500
export const BOARD_HEIGHT = 500
export const HORIZONTAL_SQUARE_COUNT = 25
export const VERTICAL_SQUARE_COUNT = HORIZONTAL_SQUARE_COUNT
export const SQUARE_WIDTH = BOARD_WIDTH / HORIZONTAL_SQUARE_COUNT
export const SQUARE_HEIGHT = BOARD_HEIGHT / VERTICAL_SQUARE_COUNT
export const PLAYER_VELOCITY = 1
export const PLAYER_SIZE = 19
export const PLAYER_COLOR = '#307518'
export const FOOD_COLOR = '#307518'

export enum GameState {
	Running = 'running',
	Paused = 'paused',
	GameOver = 'game-over',
}
