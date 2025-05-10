import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom';

const render = (ui: React.ReactElement, options = {}) => rtlRender(ui, options);

// re-export everything
export * from '@testing-library/react';

// override render method
export { render }; 