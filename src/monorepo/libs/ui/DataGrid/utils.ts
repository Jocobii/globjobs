import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import has from 'lodash/has';

export type SortOptions = {
  field: string;
  sort: 'desc' | 'asc';
};

export const getSort = (options: SortOptions[]) => {
  if (options.length === 0) return null;

  const [{ field, sort }] = options;

  return `${sort === 'desc' ? '-' : ''}${field}`;
};

export const sanitizer = (obj: any) => omitBy(obj, isNil);

export const removeDuplicates: any = (data: any, key: any) => [
  ...new Map(data.map((x: any) => [key(x), x])).values(),
];

type Item = {
  columnField: string;
  operatorValue: string;
  value: string;
};

export const filterOption = (prev: any, options: any) => {
  let newModelOptions = prev;

  if (Array.isArray(options)) {
    newModelOptions = { ...prev };
    // * Sort event
    newModelOptions.sort = getSort(options as any);
    newModelOptions = sanitizer(newModelOptions);
  } else if (typeof options === 'object') {
    // * Filter event
    const {
      items: [firstFilter],
    } = options;

    if (has(firstFilter, 'value')) {
      if (!firstFilter?.value && newModelOptions.filter) {
        newModelOptions = { ...prev };
        delete newModelOptions.filter;
      } else if (firstFilter?.value || ['isEmpty', 'isNotEmpty'].includes(firstFilter?.operatorValue)) {
        newModelOptions = { ...prev };

        newModelOptions.filter = options.items.map((f: Item) => ({
          c: f.columnField,
          o: f.operatorValue,
          v: f.value,
        }));
      }
    }
  } else if (typeof options === 'number') {
    newModelOptions = { ...prev };
    // * Page event
    newModelOptions.page = options + 1;
  }

  return newModelOptions;
};
