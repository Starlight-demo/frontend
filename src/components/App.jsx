import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import { Header } from './Header';
import { Router } from './Router';
import { Footer } from './Footer';
import { PreLoader } from './PreLoader';
import { AuthProvider } from './Authorization/components/AuthProvider';

export const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Box sx={{ backgroundColor: 'neutral.whiteGrey' }}>
            <CssBaseline />
            {loading ? (
              <PreLoader />
            ) : (
              <>
                <Header />
                <Router />
                <Footer />
              </>
            )}
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
