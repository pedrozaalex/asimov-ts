import { Component } from '@asimov-ts/core'

export type IEventPayloadValue = number | string | boolean | object

export interface IEvent {
	type: string
	payload?: IEventPayloadValue | IEventPayloadValue[]
}

export class EventQueue extends Component<IEvent[]> {
	constructor(events: IEvent[] = []) {
		super(events)
	}
}
