declare type Aeach<T = unknown, R = unknown> = {
  array: T[];
  callback: (item: T, index: number, array: T[]) => Promise<R>;
};

export async function aeach<T, R>({ array, callback }: Aeach<T, R>) {
  const results = [];
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await callback(array[index], index, array));
  }
  return results;
}
