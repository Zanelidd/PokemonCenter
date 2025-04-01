import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Sentry from '@sentry/react';
import FallbackComponent from "./components/FallbackComponent.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Sentry.ErrorBoundary fallback={<FallbackComponent/>} showDialog>
            <App/>
        </Sentry.ErrorBoundary>
    </React.StrictMode>,
);
