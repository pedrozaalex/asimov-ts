import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import { BaseStore, IStore } from './store';
import { pipe } from 'fp-ts/lib/function';

describe('Store', () => {
  let store: IStore<string>;

  beforeEach(() => {
    store = new BaseStore<string>();
  });

  test('Should set a value correctly', () => {
    const key = 'key';
    const value = 'value';

    const setResult = store.set(key, value);

    expect(E.isRight(setResult)).toBe(true);
  });

  test('Should get a value correctly after setting it', () => {
    const key = 'key';
    const value = 'value';

    store.set(key, value);

    const getResult = store.get(key);

    expect(O.isSome(getResult)).toBe(true);
    expect(
      pipe(
        getResult,
        O.getOrElse(() => '')
      )
    ).toEqual(value);
  });

  test('Should remove a value correctly', () => {
    const key = 'key';
    const value = 'value';

    store.set(key, value);

    const removeResult = store.remove(key);

    expect(E.isRight(removeResult)).toBe(true);

    const getResult = store.get(key);

    expect(O.isNone(getResult)).toBe(true);
  });
});
