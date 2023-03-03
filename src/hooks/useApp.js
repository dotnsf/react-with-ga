import { useState } from 'react';

const useApp = () => {
  let initialLoginInfo = null;
  const loginInfoStr = sessionStorage.getItem('loginInfo');
  if (loginInfoStr) {
    initialLoginInfo = JSON.parse(loginInfoStr);
  }

  const [loginInfo, setLoginInfo] = useState(initialLoginInfo);

  const [postLoginUrl, setPostLoginUrl] = useState('/top');

  const [isLoading, setIsLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [dialog, setDialog] = useState({
    type: null,
    title: '',
    body: ''
  });

  const [dialogResolver, setDialogResolver] = useState(null);

  const showMessageDialog = async (title, body) => {
    setDialog({ type: 'Message', title: title, body: body });
    return new Promise((resolve) => setDialogResolver(() => resolve));
  };

  const showConfirmDialog = async (title, body) => {
    setDialog({ type: 'Confirm', title: title, body: body });
    return new Promise((resolve) => setDialogResolver(() => resolve));
  };

  const handleCloseDialog = (result) => {
    setDialog({ type: null, title: '', body: '' });
    if (dialogResolver) {
      dialogResolver(result);
      setDialogResolver(null);
    }
  };

  const processAsync = async (handler, errorHandler) => {
    try {
      setIsLoading(true);
      await handler();
    } catch (err) {
      if (errorHandler) {
        errorHandler(err);
      } else {
        handleError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    if (!err.response) {
      // normal runtime error
      showMessageDialog('use_app.error', 'use_app.unexpected_error' );
    } else {
      // http error
      const messages = {
        400: 'use_app.http_400',
        401: 'use_app.http_401',
        403: 'use_app.http_403',
        404: 'use_app.http_404',
        500: 'use_app.http_500',
      };
      const hint = err.response.data ? err.response.data.message : null;
      const message = messages[err.response.status] ? messages[err.response.status] : 'use_app.unexpected_error';
      showMessageDialog('use_app.error', message + (hint ? `<br>(${hint})` : ''));
    }
  };

  return {
    loginInfo,
    setLoginInfo,
    postLoginUrl,
    setPostLoginUrl,
    isLoading,
    setIsLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    dialog,
    showMessageDialog,
    showConfirmDialog,
    handleCloseDialog,
    processAsync,
  };
};

export default useApp;
