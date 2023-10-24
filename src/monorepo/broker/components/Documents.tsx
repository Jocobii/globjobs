import { Box, Typography, Stack } from '@mui/material';

type DocumentsType = {
  name: string;
  url: string;
  ext: string;
};

type Props = {
  documents: DocumentsType[];
};

function getIcon(ext: string) {
  switch (ext) {
    case 'pdf':
      return 'assets/pdf.png';
    case 'csv':
      return 'assets/csv.png';
    case 'xls':
      return 'assets/xls.png';
    case 'txt':
      return 'assets/txt.png';
    case 'png':
      return 'assets/png.png';
    case 'xml':
      return 'assets/xml.png';
    default:
      return 'assets/file.png';
  }
}

export default function Documents({ documents }: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          lg: 'repeat(2, 1fr)',
          md: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        },
        width: '100%',
        gap: 2,
      }}
    >
      {documents.map(({ name, url, ext }) => (
        <Box
          key={`Document - ${url}`}
          sx={{
            border: 'none',
            minWidth: '0px',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => {
            const link = document.createElement('a');
            link.setAttribute('download', name);
            link.target = '_blank';
            link.href = url;
            link.click();
          }}
        >
          <Stack sx={{ mt: 5 }} justifyContent="center" alignItems="center" spacing={1}>
            <Box component="img" src={getIcon(ext)} sx={{ width: 50, height: 50 }} />
            <Typography variant="body2" sx={{ position: 'relative' }}>
              {name}
            </Typography>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
