import { Component, Entity } from '@asimov-ts/core'
import { JSX } from 'solid-js'

interface UIBlockProps<BlockState> {
	mapEntitiesToProps: (entities: Entity[]) => BlockState
	render: (state: BlockState) => JSX.Element
}

export class UIBlockComponent<BlockState> extends Component<UIBlockProps<BlockState>> {}
