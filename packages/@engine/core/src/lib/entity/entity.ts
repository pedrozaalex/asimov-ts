import { isSome, Option } from 'fp-ts/lib/Option';
import { nanoid } from 'nanoid';
import { IComponent } from '../component';
import { IStore } from '../store';

export class Entity {
  public id: string;
  private componentStore: IStore<IComponent>;

  constructor(componentStore: IStore<IComponent>) {
    this.id = nanoid();
    this.componentStore = componentStore;
  }

  public equals(other: Entity): boolean {
    return this.id === other.id;
  }

  public getComponentValue<T>(component: IComponent): Option<T> {
    return this.componentStore.get(component.id) as Option<T>;
  }

  public setComponent(component: IComponent) {
    this.componentStore.set(component.id, component);

    return this;
  }

  public hasComponent(component: IComponent) {
    return isSome(this.componentStore.get(component.id));
  }

  public removeComponent(component: IComponent) {
    this.componentStore.remove(component.id);
  }
}
