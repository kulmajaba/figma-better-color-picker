import { createRoot } from 'react-dom/client';

import App from './App';
import { ColorSpaceProvider } from './hooks/useColorSpace';
import { ContrastCheckerProvider } from './hooks/useContrastChecker';
import { CopyFormatProvider } from './hooks/useCopyFormat';
import { ThemeProvider } from './hooks/useTheme';

import './index.css';

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <ThemeProvider>
    <ColorSpaceProvider>
      <ContrastCheckerProvider>
        <CopyFormatProvider>
          <App />
        </CopyFormatProvider>
      </ContrastCheckerProvider>
    </ColorSpaceProvider>
  </ThemeProvider>
);
