import { createGame } from '@asimov/core'
import invariant from 'tiny-invariant'
import { Food, Player, Wall } from './entities'
import { CollisionSystem } from './systems/Collision.system'
import { InputSystem } from './systems/Input.system'
import { MovementSystem } from './systems/Movement.system'
import { RenderingSystem } from './systems/Rendering.system'

const BOARD_WIDTH = 500
const BOARD_HEIGHT = 500
const WALL_THICKNESS = 10

const root = document.getElementById('root')

invariant(root, 'Could not find root element in document')

createGame()
	// Player
	.withEntity(new Player(20, 20))

	// Food
	.withEntity(new Food(200, 360))

	// Walls
	.withEntity(new Wall(0, 0, WALL_THICKNESS, BOARD_HEIGHT))
	.withEntity(new Wall(0, 0, BOARD_WIDTH, WALL_THICKNESS))
	.withEntity(
		new Wall(BOARD_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, BOARD_HEIGHT)
	)
	.withEntity(
		new Wall(0, BOARD_HEIGHT - WALL_THICKNESS, BOARD_WIDTH, WALL_THICKNESS)
	)

	// Systems
	.withSystem(new RenderingSystem())
	.withSystem(new MovementSystem())
	.withSystem(new InputSystem())
	.withSystem(new CollisionSystem())

	// Initialization
	.build()
	.initialize()
