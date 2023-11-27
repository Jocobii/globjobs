import { matchPath } from 'react-router-dom';

export function isExternalLink(path: string) {
  return path.includes('http');
}

export function getActive(path: string, pathname: string) {
  return path ? !!matchPath({ path }, pathname) : false;
}
export function difference<T extends Record<string, unknown>>(a: T, b: T): Partial<T> {
  return Object.keys(a)
    .reduce((acc, key) => (a[key] !== b[key]
      ? { ...acc, [key]: b[key] }
      : acc), {});
}

export const getLocalStorage = (
  key: string,
) => JSON.parse(window.localStorage.getItem(key) as string);

export const setLocalStorage = (
  key: string,
  value: unknown,
) => window.localStorage.setItem(key, JSON.stringify(value));

export const deleteLocalStorage = (key: string) => window.localStorage.removeItem(key);
