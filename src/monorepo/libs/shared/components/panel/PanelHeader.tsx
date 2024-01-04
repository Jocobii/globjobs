import React, {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Grid,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useCrossing } from '@gsuite/shared/contexts';
import { useTranslation } from 'react-i18next';
import RequiredActionsMenu from './RequiredActionsMenu';

type Props = {
  isCostumer?: boolean;
  isTrafficFlow?: boolean;
  requiredActionsMenuIsOpen?: boolean;
  setRequiredActionsMenuIsOpen?: Dispatch<SetStateAction<boolean>>;
};

interface SpecialistProps {
  specialist: {
    id?: string;
    name?: string;
    lastName?: string;
  } | undefined;
}
function SpecialistAvatar({ specialist }: SpecialistProps) {
  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      <Grid item>
        <Avatar>{specialist?.name?.charAt(0) ?? ''}</Avatar>
      </Grid>
      <Grid item xs zeroMinWidth>
        <Typography sx={{ fontSize: '12px', mt: 1 }}>{`${specialist?.name ?? ''} ${specialist?.lastName ?? ''}`}</Typography>
      </Grid>
    </Grid>
  );
}

export default function PanelHeader({
  isCostumer = false,
  requiredActionsMenuIsOpen = false,
  isTrafficFlow = false,
  setRequiredActionsMenuIsOpen = undefined,
}: Props) {
  const { crossing } = useCrossing();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const chipRef = useRef(null);
  const open = !!anchorEl || !!requiredActionsMenuIsOpen;
  const activeRequiredActions = crossing?.requiredActions?.filter((ra) => !ra.resolved) ?? [];

  const handleRequiredActionsMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      {isCostumer && activeRequiredActions.length > 0 && (
        <Stack direction="row" justifyContent="flex-start" py={2}>
          <Chip
            ref={chipRef}
            onClick={handleRequiredActionsMenu}
            label="Acciones Requeridas"
            avatar={<Avatar>{activeRequiredActions.length}</Avatar>}
            color="error"
            size="medium"
          />
        </Stack>
      )}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Grid item xs zeroMinWidth>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>{t('cruces.history.client')}</Typography>
          </Grid>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item>
              <Avatar>{crossing?.customerUser?.name?.charAt(0) ?? ''}</Avatar>
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography sx={{ fontSize: '12px', mt: 1 }}>{`${crossing?.customerUser?.name ?? ''} ${crossing?.customerUser?.lastName ?? ''}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs zeroMinWidth>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>{t('cruces.history.specialist')}</Typography>
          </Grid>
          <SpecialistAvatar
            specialist={
              isTrafficFlow ? crossing?.trafficUser : crossing?.user
            }
          />
        </Grid>
      </Grid>
      <RequiredActionsMenu
        requiredActions={activeRequiredActions}
        open={open}
        anchorEl={chipRef.current}
        setAnchorEl={setAnchorEl}
        setRequiredActionsMenuIsOpen={setRequiredActionsMenuIsOpen}
      />
    </>
  );
}
