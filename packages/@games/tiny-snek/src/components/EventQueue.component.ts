import { Component } from '@asimov/core'
import { GameEvent } from '../systems/Events.system'

export type IEventPayloadValue = number | string | boolean | object

export interface IEvent {
	type: GameEvent
	payload?: IEventPayloadValue | IEventPayloadValue[]
}

export class EventQueue extends Component<IEvent[]> {
	constructor(events: IEvent[] = []) {
		super(events)
	}
}
