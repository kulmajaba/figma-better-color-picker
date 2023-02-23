import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { ColorSpaceProvider } from './hooks/useColorSpace';
import { ComparisonColorProvider } from './hooks/useComparisonColors';
import { CopyFormatProvider } from './hooks/useCopyFormat';

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <ColorSpaceProvider>
    <ComparisonColorProvider>
      <CopyFormatProvider>
        <App />
      </CopyFormatProvider>
    </ComparisonColorProvider>
  </ColorSpaceProvider>
);
