import { gql, useQuery } from '@apollo/client';
import type { Pediment, TreeNode } from './type';

export const COMPANIES_SAP_QUERY = gql`
  query {
    getSAPCompanies {
      Numero
      Nombre
      RFC
      Direccion
      Colonia
      Ciudad
      CP
      correoElectronico
      EstadoSAT
      label
      existsInDb
    }
  }
`;

export const ADP_FILES_QUERY = gql`
mutation($start: String!, $end: String!, $company: String!, $pedimento: String!) {
  getADPFiles(start: $start, end: $end, company: $company, pedimento: $pedimento){
    body {
      data {
        files {
          fileName
          route
          selected
        }
          aduana
          clave
          cliente
          customHouse
          customLicense
          customsDeclaration
          dir
          facturas
          fechaDePagoBanco
          fechaPedimento
          fecha_de_pago
          iD
          patente
          pediment
          pedimentDate
          pediment_dir
          pedimento
          size
          tipo
          total_files
          year
      }
    }
    statusCode
  }
}`;

export const ADP_DOWNLOAD_FILES = gql`
mutation($downloadData: DownloadInput!) {
  downloadADPFiles(downloadData: $downloadData){
    message
  }
}`;

export const useCompaniesSap = () => useQuery(COMPANIES_SAP_QUERY, { context: { clientName: 'globalization' } });

export const getFiles = async (variables: any) => {
  const {
    client, startDate, endDate, pedimentos,
  } = variables;
  const params = new URLSearchParams();
  if (pedimentos && pedimentos.length > 0) {
    params.append('pedimento', pedimentos.join(','));
  } else {
    params.append('endDate', endDate);
    params.append('startDate', startDate);
  }
  params.append('client', client);
  return fetch(`http://54.88.196.31:5050/api/search?${params.toString()}`).then((res) => res.json());
};

export const transformData = (data: Pediment[]) => {
  const tree: TreeNode = {
    id: 'root',
    name: 'Parent',
    children: [],
    type: 'root',
    year: '',
    extra: {},
  };

  data.forEach((item) => {
    let yearNode: any = tree.children && tree.children?.find((node) => node.id === item.year);
    if (!yearNode) {
      yearNode = { id: item.year, name: item.year, children: [] };
      tree.children?.push(yearNode);
    }
    let customDeclarationNode = yearNode.children?.find(
      (node:TreeNode) => node.id === item.customsDeclaration,
    );
    if (!customDeclarationNode) {
      customDeclarationNode = {
        id: item.customsDeclaration,
        name: item.customsDeclaration,
        extra: {
          ...item,
        },
        children: [],
      };
      yearNode.children?.push(customDeclarationNode);
    }
    const fileNodes = item.files.map((file) => ({
      id: file.fileName,
      name: file.fileName,
      extra: {
        ...file,
      },
    }));
    customDeclarationNode.children?.push(...fileNodes);
  });

  return tree;
};

export const validEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validPediment = (pediment: string) => {
  const re = /^[0-9]{7}$/;
  return re.test(pediment);
};
