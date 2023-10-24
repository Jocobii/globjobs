import { useState } from 'react';
import { Button } from '@mui/material';
import { NodeModels } from '@gsuite/typings/files';
import { Label as LabelIcon } from '@mui/icons-material';
import UploadFile from './UploadFileToFolder';

function DodaPitaShortCut({ node }: { node: NodeModels }) {
  const [dodaIsOpen, setDodaIsOpen] = useState(false);
  return (
    <>
      <Button
        startIcon={<LabelIcon />}
        variant="outlined"
        size="small"
        sx={{
          p: 0.2,
          fontSize: 8,
        }}
        onClick={() => setDodaIsOpen(!dodaIsOpen)}
      >
        {node?.data?.tags}
      </Button>
      <UploadFile isOpen={dodaIsOpen} setIsOpen={() => setDodaIsOpen(!dodaIsOpen)} targetFolder="despacho" />
    </>
  );
}

export default DodaPitaShortCut;
