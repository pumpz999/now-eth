import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';

type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange';
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  toggleMode: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  colorScheme: 'default',
  toggleMode: () => {},
  setColorScheme: () => {},
});

const colorSchemes = {
  default: {
    light: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
    dark: {
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
    },
  },
  blue: {
    light: {
      primary: { main: '#2196f3' },
      secondary: { main: '#f50057' },
    },
    dark: {
      primary: { main: '#82b1ff' },
      secondary: { main: '#ff4081' },
    },
  },
  green: {
    light: {
      primary: { main: '#4caf50' },
      secondary: { main: '#ff4081' },
    },
    dark: {
      primary: { main: '#69f0ae' },
      secondary: { main: '#ff80ab' },
    },
  },
  purple: {
    light: {
      primary: { main: '#7b1fa2' },
      secondary: { main: '#f50057' },
    },
    dark: {
      primary: { main: '#ba68c8' },
      secondary: { main: '#ff4081' },
    },
  },
  orange: {
    light: {
      primary: { main: '#ff9800' },
      secondary: { main: '#f50057' },
    },
    dark: {
      primary: { main: '#ffb74d' },
      secondary: { main: '#ff4081' },
    },
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...colorSchemes[colorScheme][mode],
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: mode === 'dark' ? '#6b6b6b #2b2b2b' : '#959595 #f5f5f5',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: mode === 'dark' ? '#6b6b6b' : '#959595',
                  minHeight: 24,
                },
                '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                  borderRadius: 8,
                  backgroundColor: mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
                },
              },
            },
          },
        },
      }),
    [mode, colorScheme]
  );

  const value = useMemo(
    () => ({
      mode,
      colorScheme,
      toggleMode,
      setColorScheme,
    }),
    [mode, colorScheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
