import { Entity, ISystem } from "@asimov-ts/core";
import { getOrElse, isSome } from "fp-ts/lib/Option";
import { EventListener, EventQueue, IEvent } from "../components";

export class EventsSystem implements ISystem {
  name = "EventsSystem";

  filter(entity: Entity) {
    return (
      entity.hasComponent(EventQueue) || entity.hasComponent(EventListener)
    );
  }

  update(params: { entities: Entity[] }) {
    const events = params.entities
      .map((entity) => entity.getComponentValue(EventQueue))
      .filter(isSome)
      .map(getOrElse(() => [] as IEvent[]))
      .reduce((acc, curr) => [...acc, ...curr], []);

    const listeners = params.entities
      .map((entity) => entity.getComponentValue(EventListener))
      .filter(isSome)
      .map(getOrElse(() => ({} as Partial<Record<string, () => void>>)));

    events.forEach((event) => {
      listeners.forEach((listener) => listener[event.type]?.());
    });

    // We assume all events have been processed, so we clear the queues
    params.entities.forEach((entity) => {
      entity.setComponent(new EventQueue());
    });
  }
}
