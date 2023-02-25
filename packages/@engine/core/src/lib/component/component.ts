import { nanoid } from 'nanoid'

type Value = string | number | boolean

export type IComponentValue = Value | Value[] | object

export type ComponentID = string

export interface IComponentInstance<ValueType extends IComponentValue> {
	id: ComponentID
	value: ValueType
}

export interface IComponentType<ValueType extends IComponentValue> {
	new (value: any): Component<ValueType>
	id: ComponentID
}

export abstract class Component<ValueType extends IComponentValue>
	implements IComponentInstance<ValueType>
{
	private static _secretIdentifier: ComponentID

	public static get id(): ComponentID {
		if (!this._secretIdentifier) {
			this._secretIdentifier = nanoid()
		}

		return this._secretIdentifier
	}

	public value: ValueType

	public constructor(value: ValueType) {
		// @ts-expect-error: This is a workaround for https://github.com/Microsoft/TypeScript/issues/3841
		if (!this.constructor._secretIdentifier)
			this.constructor._secretIdentifier = nanoid()

		this.value = value
	}

	public get id(): ComponentID {
		// @ts-expect-error: Same as above
		return this.constructor._secretIdentifier
	}
}
