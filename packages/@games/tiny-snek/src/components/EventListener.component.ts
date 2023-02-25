import { Component } from '@asimov/core'
import { GameEvent } from '../systems/Events.system'

export class EventListener extends Component<
	Partial<Record<GameEvent, () => void>>
> {}
