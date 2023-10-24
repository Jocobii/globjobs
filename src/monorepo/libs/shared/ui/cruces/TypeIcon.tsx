import FolderIcon from '@mui/icons-material/Folder';
import { Button } from '@mui/material';
import {
  txtIcon, xlsIcon, csvIcon, pdfIcon, pngIcon, fileIcon,
} from '@gsuite/shared/assets';

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

  const ext = icon.toLowerCase() as 'pdf' | 'csv' | 'txt' | 'xls' | 'png';

  const printFile = () => {
    if (url) {
      if (['pdf'].includes(ext)) {
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
      body = <img src={pdfIcon} alt="pdf" height={40} width={40} draggable={false} />;
      break;
    case 'csv':
      body = <img src={csvIcon} alt="csv" height={40} width={40} draggable={false} />;
      break;
    case 'xls':
      body = <img src={xlsIcon} alt="xls" height={40} width={40} draggable={false} />;
      break;
    case 'txt':
      body = <img src={txtIcon} alt="txt" height={40} width={40} draggable={false} />;
      break;
    case 'png':
      body = <img src={pngIcon} alt="png" height={40} width={40} draggable={false} />;
      break;
    default:
      body = <img src={fileIcon} alt="file" height={40} width={40} draggable={false} />;
      break;
  }
  return (
    <Button onClick={printFile} sx={{ p: 0, m: 0 }}>
      {body}
    </Button>
  );
}
