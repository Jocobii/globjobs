export const capitalizeFirstLetter = (word: string) => {
  const wordToLower = word.toLowerCase();

  return wordToLower.charAt(0).toUpperCase() + wordToLower.slice(1);
};

export const splitOnCapitalLetter = (str: string) => str
  .trim()
  .split(/(?=[A-Z])/)
  .map((element) => element.trim())
  .join(' ')
  .toLowerCase();

export const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T) => fns
  .reduce((acc, fn) => fn(acc), value);

export const normalizeKeyName = (
  keyName: string,
) => pipe(splitOnCapitalLetter, capitalizeFirstLetter)(keyName);

export const stringIncludes = (sentence = '', word = '') => sentence.toLowerCase().includes(word.toLowerCase());

export const getThemeMode = () => JSON.parse(localStorage.getItem('wms.config') ?? '{"mode":"dark"}')?.mode || 'dark';

export const getCustomPropsFromError = (error: any) => {
  if (!error.response?.errors?.length) return { i18Key: 'GENERIC_ERROR' };
  return {
    i18Key: 'GENERIC_ERROR',
    ...error.response.errors[0].extensions.exception.response,
  };
};
