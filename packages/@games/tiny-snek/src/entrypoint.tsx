import { createGame } from '@asimov/core'
import { Food, Player, StateTracker } from './buildables'
import { UserInterface } from './buildables/UserInterface.buildable'
import {
	CollisionSystem,
	EventsSystem,
	InputSystem,
	MovementSystem,
	RenderingSystem,
	UIUpdaterSystem,
} from './systems'
import { TrackPlayerSystem } from './systems/TrackPlayer.system'

createGame()
	.withBuildable(new Player())
	.withBuildable(new Food())
	.withBuildable(new StateTracker())
	.withBuildable(new UserInterface())

	.withSystem(new InputSystem())
	.withSystem(new MovementSystem())
	.withSystem(new TrackPlayerSystem())
	.withSystem(new CollisionSystem())
	.withSystem(new RenderingSystem())
	.withSystem(new EventsSystem())
	.withSystem(new UIUpdaterSystem())

	.build()
	.initialize()
