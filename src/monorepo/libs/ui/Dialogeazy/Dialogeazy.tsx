import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  Box,
  Paper,
} from '@mui/material';

import Conditional from '../Conditional';
import { varSlide } from './Animations/slide';

export const DRAWER_WIDTH = 600;

type Props = {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
};

const { animate, exit, initial } = varSlide({
  distance: 120,
  durationIn: 0.32,
  durationOut: 0.24,
  easeIn: 'easeInOut',
}).inRight;

function PaperComponent({
  children, className, role,
}: any) {
  return (
    <Box
      component={motion.div}
      animate={animate}
      exit={exit}
      initial={initial}
      sx={{
        height: '100%',
        position: 'fixed',
        right: 0,
      }}
    >
      <Paper className={className} role={role}>
        {children}
      </Paper>
    </Box>
  );
}

export default function Dialogeazy({
  open = false,
  onClose,
  children,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      <Conditional
        loadable={open}
        initialComponent={null}
      >
        <Dialog
          open={open}
          onClose={onClose}
          fullScreen
          fullWidth
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
          keepMounted={false}
          PaperComponent={PaperComponent}
        >
          {children}
        </Dialog>
      </Conditional>
    </AnimatePresence>
  );
}
