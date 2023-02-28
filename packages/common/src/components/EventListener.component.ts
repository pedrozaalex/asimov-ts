import { Component } from "@asimov-ts/core";

export class EventListener extends Component<
  Partial<Record<string, () => void>>
> {}
