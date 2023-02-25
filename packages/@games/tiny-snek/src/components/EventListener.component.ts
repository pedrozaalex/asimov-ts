import { Component } from '@asimov/core'
import { GameEvent } from '../systems'

export class EventListener extends Component<
	Partial<Record<GameEvent, () => void>>
> {}
