import { createGame } from '@asimov/core'
import { Food, Player, Wall } from './entities'
import { CollisionSystem } from './systems/Collision.system'
import { InputSystem } from './systems/Input.system'
import { MovementSystem } from './systems/Movement.system'
import { RenderingSystem } from './systems/Rendering.system'

export const BOARD_WIDTH = 500
export const BOARD_HEIGHT = 500
export const WALL_THICKNESS = 10
export const HORIZONTAL_SQUARE_COUNT = 25
export const VERTICAL_SQUARE_COUNT = HORIZONTAL_SQUARE_COUNT
export const PLAYABLE_AREA_WIDTH = BOARD_WIDTH - WALL_THICKNESS * 2
export const PLAYABLE_AREA_HEIGHT = BOARD_HEIGHT - WALL_THICKNESS * 2
export const SQUARE_WIDTH = PLAYABLE_AREA_WIDTH / HORIZONTAL_SQUARE_COUNT
export const SQUARE_HEIGHT = PLAYABLE_AREA_HEIGHT / VERTICAL_SQUARE_COUNT

const walls = [
	new Wall(0, 0, WALL_THICKNESS, BOARD_HEIGHT),
	new Wall(0, 0, BOARD_WIDTH, WALL_THICKNESS),
	new Wall(BOARD_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, BOARD_HEIGHT),
	new Wall(0, BOARD_HEIGHT - WALL_THICKNESS, BOARD_WIDTH, WALL_THICKNESS),
]

createGame()
	.withEntity(
		new Player(WALL_THICKNESS + SQUARE_WIDTH, WALL_THICKNESS + SQUARE_HEIGHT)
	)

	.withEntity(
		new Food({
			minX: WALL_THICKNESS,
			maxX: BOARD_WIDTH - WALL_THICKNESS,
			minY: WALL_THICKNESS,
			maxY: BOARD_HEIGHT - WALL_THICKNESS,
		})
	)

	.withEntities(walls)

	.withSystem(new RenderingSystem())
	.withSystem(new MovementSystem())
	.withSystem(new InputSystem())
	.withSystem(new CollisionSystem())

	.build()
	.initialize()
