import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Stack, Alert, TextField, IconButton, InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { SignInFormValues } from '../typings/auth';
import useAuth from '../hooks/useAuth';
import { hashPassword } from '../utils/hasher';

const schema = yup.object({
  email: yup.string().min(5).trim().required(),
  password: yup.string().min(5).trim().required(),
});

export default function SignInForm() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formValues: SignInFormValues) => {
    try {
      await login(formValues.email, hashPassword(formValues.password));
    } catch (error) {
      let message: string = error as string;
      if (typeof error !== 'string') message = (error as Error).message;

      setError('server', { message });
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <form autoComplete="off">
      <Stack spacing={3}>
        {errors.server && (
          <Alert severity="error">
            <strong>{(errors.server.message ?? t('dictionary.unavailable')) as string}</strong>
          </Alert>
        )}

        <Controller
          name="email"
          control={control}
          render={({
            field: {
              onChange, onBlur, value, name,
            },
          }) => (
            <TextField
              fullWidth
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={Boolean(errors[name])}
              helperText={errors[name]?.message}
              autoComplete="off"
              label={t('input.email')}
              InputProps={{
                endAdornment: <InputAdornment position="end">@g-global.com</InputAdornment>,
              }}
              data-cy="user-input"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({
            field: {
              onChange, onBlur, value, name,
            },
          }) => (
            <TextField
              fullWidth
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={Boolean(errors[name])}
              helperText={errors[name]?.message}
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label={t('input.password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              data-cy="pass-input"
            />
          )}
        />

        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          data-cy="submit"
        >
          {t('signInButton')}
        </LoadingButton>
      </Stack>
    </form>
  );
}
