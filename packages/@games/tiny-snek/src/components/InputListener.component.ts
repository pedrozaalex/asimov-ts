import { Component } from '@asimov/core';

export class InputListener extends Component<
	Partial<Record<string, (() => void) | undefined>>
> {}
