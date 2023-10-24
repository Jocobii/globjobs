import axios from '@gsuite/shared/utils/crossingAxios';

export const getIntegrationNumber = async (file: string, id: string): Promise<string> => axios.post('/integrationNumber', { file, id });
