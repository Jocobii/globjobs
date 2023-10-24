import ImageIcon from '@mui/icons-material/Image';
import PDFIcon from '@mui/icons-material/PictureAsPdf';

import InsertPageBreakOutlinedIcon from '@mui/icons-material/InsertPageBreakOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

export const getIconBasedOnFileExtension = (fileName: string) => {
  const extension = fileName.split('.').pop();
  switch (extension) {
    case 'pdf' || 'PDF':
      return <PDFIcon />;
    case 'xml':
      return <InsertPageBreakOutlinedIcon />;
    case 'txt':
      return <TextSnippetOutlinedIcon />;
    default:
      return <ImageIcon />;
  }
};

export default getIconBasedOnFileExtension;
