import axios from '@gsuite/shared/utils/crossingAxios';

export const getPedimentoProforma = async (file: string, id: string): Promise<string> => axios.post('/proformaPedimento', { file, id });
