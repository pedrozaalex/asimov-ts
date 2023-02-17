import { nanoid } from 'nanoid'

export type IComponentValue =
	| string
	| number
	| boolean
	| Array<unknown>
	| Record<string, unknown>

export type ComponentID = string

export interface IComponent<ValueType extends IComponentValue> {
	new (): Component<ValueType>
	id: ComponentID
}

export abstract class Component<_ValueType extends IComponentValue> {
	private static _secretIdentifier: ComponentID

	public static get id(): ComponentID {
		if (!this._secretIdentifier) {
			this._secretIdentifier = nanoid()
		}

		return this._secretIdentifier
	}

	public constructor() {
		// @ts-expect-error: This is a static property
		if (!this.constructor._identifier) this.constructor._identifier = nanoid()
	}

	public get id(): ComponentID {
		// @ts-expect-error: This is a static property
		return this.constructor._identifier
	}
}
