import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { ColorSpaceProvider } from './hooks/useColorSpace';
import { ColorTableProvider } from './hooks/useColorTable';
import { ComparisonColorProvider } from './hooks/useComparisonColors';

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <ColorSpaceProvider>
    <ComparisonColorProvider>
      <ColorTableProvider>
        <App />
      </ColorTableProvider>
    </ComparisonColorProvider>
  </ColorSpaceProvider>
);
