import { createRoot } from 'react-dom/client';

import { App } from './App';
import { Document } from './Document';

// eslint-disable-next-line no-undef
createRoot(document.querySelector('#root')).render(
    <Document>
        <App />
    </Document>
);
