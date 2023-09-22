import dayjs from 'dayjs';

export const DD_MM_YYYY = 'DD/MM/YYYY';
export const DD_MM_YYYY_HH_MM = 'DD/MM/YYYY HH:mm';

export const parseDate = (value?: string, format = DD_MM_YYYY) => (value ? dayjs(value).format(format) : 'N/A');