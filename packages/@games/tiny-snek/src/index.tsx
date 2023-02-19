import { createGame } from '@asimov/core'
import invariant from 'tiny-invariant'
import { Food, Player, Wall } from './entities'
import { RenderingSystem } from './systems/Rendering.system'

const BOARD_WIDTH = 100
const BOARD_HEIGHT = 100
const WALL_THICKNESS = 10

const root = document.getElementById('root')

invariant(root, 'Could not find root element in document')

createGame()
	// Player
	.withEntity(new Player())

	// Food
	.withEntity(new Food())

	// Walls
	.withEntity(new Wall(0, 0, WALL_THICKNESS, BOARD_HEIGHT))
	.withEntity(new Wall(0, 0, BOARD_WIDTH, WALL_THICKNESS))
	.withEntity(new Wall(90, 0, WALL_THICKNESS, BOARD_HEIGHT))
	.withEntity(new Wall(0, 90, BOARD_WIDTH, WALL_THICKNESS))

  // Systems
  .withSystem(new RenderingSystem())

  // Initialization
	.build()
	.initialize()
