import { useState, useEffect } from 'react';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { CircularLoader } from '@gsuite/shared/ui';
import { getExtByName } from '../utils';

type File = {
  file_token: string;
  fileName: string;
};

interface Props {
  file: Partial<File>;
  setOpenDrawer: () => void;
  openDrawer: boolean;
}

export function DrawerViewer({ file, setOpenDrawer, openDrawer }: Props) {
  const [pdf, setPdf] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLocalPdfUrl = async () => {
      setLoading(true);
      if (!file.file_token) return '';
      const ext = getExtByName(file.fileName);
      const response = await fetch(file.file_token);
      const blob = ext === 'pdf' ? await response.blob() : await response.text();
      return URL.createObjectURL(typeof blob === 'string' ? new Blob([blob]) : blob);
    };

    getLocalPdfUrl().then((url) => {
      setPdf(url);
      setLoading(false);
    });

    return () => {
      setPdf('');
    };
  }, [file.fileName, file.file_token]);

  return (
    <Dialogeazy
      open={openDrawer}
      onClose={setOpenDrawer}
    >
      {
        loading && !pdf ? (
          <CircularLoader />
        ) : (
          <iframe
            src={pdf}
            title="ADP"
            width="100%"
            height="100%"
          />
        )
      }
    </Dialogeazy>
  );
}
