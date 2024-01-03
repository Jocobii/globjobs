import FolderIcon from '@mui/icons-material/Folder';
import { Button } from '@mui/material';

type Props = {
  droppable?: boolean;
  icon?: string;
  url?: string | null;
  fileName?: string;
};

export default function TypeIcon({
  droppable = false,
  icon = 'default',
  url = null,
  fileName = 'file',
}: Props) {
  let body;
  if (droppable) {
    return (
      <FolderIcon color="primary" fontSize="large" />
    );
  }

  const ext = icon.toLowerCase() as 'pdf' | 'csv' | 'txt' | 'xls' | 'png' | 'xml';

  const printFile = () => {
    if (url) {
      if (['pdf'].includes(ext) || ['txt'].includes(ext)) {
        window.open(url);
      } else {
        // TODO: download file txt
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.${ext}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  switch (ext) {
    case 'pdf':
      body = <img src="/src/assets/pdf.png" alt="pdf" height={40} width={40} draggable={false} />;
      break;
    case 'csv':
      body = <img src="/src/assets/csv.png" alt="csv" height={40} width={40} draggable={false} />;
      break;
    case 'xls':
      body = <img src="/src/assets/xls.png" alt="xls" height={40} width={40} draggable={false} />;
      break;
    case 'xml':
      body = <img src="/src/assets/xml.png" alt="xml" height={40} width={40} draggable={false} />;
      break;
    case 'txt':
      body = <img src="/src/assets/txt.png" alt="txt" height={40} width={40} draggable={false} />;
      break;
    case 'png':
      body = <img src="/src/assets/png.png" alt="png" height={40} width={40} draggable={false} />;
      break;
    default:
      body = <img src="/src/assets/file.png" alt="file" height={40} width={40} draggable={false} />;
      break;
  }
  return (
    <Button onClick={printFile} sx={{ p: 0, m: 0 }}>
      {body}
    </Button>
  );
}
