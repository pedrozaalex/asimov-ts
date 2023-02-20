import { Component } from '@asimov/core'

export class InputListener extends Component<{
	[key: string]: () => void
}> {}
