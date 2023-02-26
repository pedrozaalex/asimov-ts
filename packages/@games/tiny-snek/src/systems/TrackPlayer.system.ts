import { Entity, ISystem } from '@asimov/core'
import { pipe } from 'fp-ts/lib/function'
import { getOrElse } from 'fp-ts/lib/Option'
import { Player, TailSegment } from '../buildables'
import {
	PlayerPositionTrackerComponent,
	TransformComponent,
} from '../components'

export class TrackPlayerSystem implements ISystem {
	name = 'TrackPlayerSystem'

	filter(entity: Entity) {
		return (
			entity.hasComponent(PlayerPositionTrackerComponent) ||
			entity instanceof Player ||
			entity instanceof TailSegment
		)
	}

	update(params: { deltaTime: number; entities: Entity[] }) {
		const playerOccupiedPositions: { x: number; y: number }[] = params.entities
			.filter(e => e instanceof Player || e instanceof TailSegment)
			.map(e =>
				pipe(
					e.getComponentValue(TransformComponent),
					getOrElse(() => ({ x: 0, y: 0 }))
				)
			)

		const position = new PlayerPositionTrackerComponent(playerOccupiedPositions)

		params.entities
			.filter(e => e.hasComponent(PlayerPositionTrackerComponent))
			.forEach(e => e.setComponent(position))
	}
}
