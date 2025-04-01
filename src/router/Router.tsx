import {
    createBrowserRouter,
    createRoutesFromChildren,
    matchRoutes,
    Navigate,
    RouterProvider,
    useLocation,
    useNavigationType
} from 'react-router-dom';
import HomePage from '../pages/homepage/HomePage';
import SetCards from '../components/setCards/SetCards';
import Card from '../components/card/Card';
import NavLayout from '../layouts/NavLayout';
import Collection from '../pages/collection/Collection';
import Results from '../pages/results/Results';
import Account from '../pages/account/Account';
import {useUser} from '../stores/UserStore';
import {ReactElement, useEffect} from 'react';
import Login from '../components/login/Login';
import VerifyEmail from '../components/verifyEmail/VerifyEmail.tsx';
import ForgetPassword from "../pages/forgetpassword/ForgetPassword.tsx";
import * as Sentry from "@sentry/react";
import { httpClientIntegration } from '@sentry/react';

const PrivateRoute = ({children}: { children: ReactElement }) => {
    const {isAuthenticated} = useUser();
    if (!isAuthenticated) {
        return <Navigate to="/home" replace/>;
    }

    return children;
};


Sentry.init({
    dsn: "https://cfc368a8e9e7d12c02eef326c3be8831@o4509067101143040.ingest.de.sentry.io/4509067134304336",
    integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect: useEffect,
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
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    profilesSampleRate: 1.0,

});
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV6(
    createBrowserRouter,
);

const Router = () => {
    const router = sentryCreateBrowserRouter([
        {
            path: "/",
            element: <NavLayout/>,
            children: [
                {path: "/home", element: <HomePage/>},
                {path: "/login", element: <Login/>},
                {
                    path: "/:setId",
                    element: <SetCards/>,
                },
                {
                    path: "/card/:cardId",
                    element: <Card/>,
                },
                {path: "/result", element: <Results/>},
                {
                    path: "/user",
                    children: [
                        {
                            path: "/user/collection",
                            element: (
                                <PrivateRoute>
                                    <Collection/>
                                </PrivateRoute>
                            ),
                        },
                        {
                            path: "/user/account",
                            element: (
                                <PrivateRoute>
                                    <Account/>
                                </PrivateRoute>
                            ),
                        },
                    ],
                },
            ],
        },
        {
            path: "/register",
            element: <Login/>,
        },
        {
            path: "/verify-email",
            element: <VerifyEmail/>,
        },
        {
            path: "/forget-pass",
            element: <ForgetPassword/>
        }
    ]);

    return <RouterProvider router={router}/>;
};

export default Router;
