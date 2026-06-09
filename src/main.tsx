import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Sentry from '@sentry/react';
import FallbackComponent from "./components/FallbackComponent.tsx";
import {
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from 'react-router-dom';
import { httpClientIntegration } from '@sentry/react';

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
        Sentry.browserApiErrorsIntegration({
            setTimeout: true,
            setInterval: true,
            requestAnimationFrame: true,
            XMLHttpRequest: true,
            eventTarget: true,
        }),
        httpClientIntegration(),
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    sendDefaultPii: false,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Sentry.ErrorBoundary fallback={<FallbackComponent/>} showDialog>
            <App/>
        </Sentry.ErrorBoundary>
    </React.StrictMode>,
);
