export function difference<T>(a: T, b: T) {
  type Key = keyof T;
  const keys = Object.keys(a as Key) as Key[];
  return keys.reduce((acc, key: Key) => {
    const valueA = a[key];
    const valueB = b[key];
    if (valueA !== valueB) {
      // eslint-disable-next-line no-param-reassign
      acc[key] = b[key];
    }
    return acc;
  }, {} as T);
}
