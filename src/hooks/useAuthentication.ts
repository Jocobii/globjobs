import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import { ClientError } from 'graphql-request';

import { useAuthStore } from '../stores/authStore';
import { useGoogleLogin } from '../services/googleLogin';
import { useLoginUser } from '../services/login';
import { loginWithGoogle } from '../lib/firebase';
import { ENVIRONMENTS_SUITE } from '../seeders';

const SOMETHING = 'Something went wrong';

export default function useAuthentication() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: googleLoginMutateAsync } = useGoogleLogin();
  const { mutateAsync: emailLoginMutateAsync } = useLoginUser();
  const {
    setErrorMessage,
    logIn,
    errorMessage,
    user,
    isAuthenticated,
    accessToken,
    logOut,
  } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const firebaseAuthResponse = await loginWithGoogle();

      if (!firebaseAuthResponse || Object.keys(firebaseAuthResponse).length < 1) {
        throw new Error('Something went wrong while trying to authenticate with Google');
      }

      const { user: firebaseUser } = firebaseAuthResponse;
      const emailAddress = get(firebaseUser, 'email', '');
      const isVerified = get(firebaseUser, 'emailVerified', false);
      const photoUrl = get(firebaseUser, 'reloadUserInfo.providerUserInfo[0].photoUrl', '');

      if (!emailAddress || !isVerified) throw new Error('User not verified on google');

      const response = await googleLoginMutateAsync({ data: { emailAddress } }).catch();

      logIn({ ...response.user, photoUrl }, response.access_token);
      setIsLoading(false);
      navigate('/g/ops');
    } catch (err) {
      let message = SOMETHING;

      if (err instanceof Error) message = err?.message;
      if (err instanceof ClientError) message = get(err, 'response.errors[0].message', SOMETHING);

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (emailAddress: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await emailLoginMutateAsync({
        data: {
          email: emailAddress,
          password,
          environment: ENVIRONMENTS_SUITE,
        },
      })
        .catch();

      logIn({ ...response.user }, response.access_token);
      setIsLoading(false);
      navigate('/g/ops');
    } catch (err) {
      let message = SOMETHING;

      if (err instanceof Error) message = err?.message;
      if (err instanceof ClientError) message = get(err, 'response.errors[0].message', SOMETHING);

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogOut = () => {
    logOut();
    navigate('/auth/login');
  };

  return {
    handleEmailLogin,
    handleLogOut,
    handleGoogleLogin,
    isLoading,
    errorMessage,
    user,
    isAuthenticated,
    accessToken,
  };
}
