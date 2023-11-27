import { GridRenderCellParams } from '@mui/x-data-grid';

export const getUserName = (params: GridRenderCellParams) => {
  const { value } = params;
  let nameExist = true;
  const lastName = value?.lastName ?? '';
  if (!value?.name && !lastName) {
    nameExist = false;
  }

  return nameExist ? `${value?.name}  ${lastName}` : 'NA';
};
