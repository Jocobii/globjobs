export type Operation = 'contains' | 'startsWith' | 'endsWith' | 'not' | 'after' | 'onOrAfter' | 'before' | 'onOrBefore' | 'is' | 'isEmpty' | 'isNotEmpty';

export type Filter = {
  c: string;
  o: Operation;
  v: string;
};

export interface PaginatedResponse<T> {
  rows: T[],
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type Variables = {
  filter?: Array<Filter>
  filterBy?: string | number;
};
