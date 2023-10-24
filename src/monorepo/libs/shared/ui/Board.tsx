import React, { useState } from 'react';

import {
  Container, Paper, Box, Typography, Dialog, IconButton, AppBar, Toolbar, Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  children?: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
};

export default function Board({ title, children = null, actions = null }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const toggleFullscreen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Dialog para fullscreen */}
      <Dialog fullScreen open={isOpen} onClose={toggleFullscreen}>
        <AppBar
          sx={{
            position: 'relative',
            minWidth: '100%',
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Toolbar
            sx={{
              minWidth: '100%',
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <Typography
              align="left"
              sx={{
                fontWeight: '600',
              }}
            >
              {title}
            </Typography>
            <IconButton
              edge="end"
              onClick={toggleFullscreen}
              sx={{
                color: '#fff',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container
          sx={{
            padding: 0,
          }}
        >
          {children}
        </Container>
      </Dialog>
      <Paper
        sx={{
          minWidth: 0,
          overflow: 'hidden',
        }}
        elevation={2}
      >
        {/* Cabecera */}
        <Box
          sx={{
            position: 'relative',
            top: 0,
            width: '100%',
            paddingX: 1,
            paddingY: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontWeight: '600',
              color: theme.palette.primary.main,
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton color="primary" onClick={toggleFullscreen}>
              <FullscreenIcon />
            </IconButton>
            {actions}
          </Stack>
        </Box>
        {/* Cuerpo */}
        <Container
          sx={{
            maxHeight: 600,
            overflow: 'auto',
          }}
        >
          {children}
        </Container>
      </Paper>
    </>
  );
}
