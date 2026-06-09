import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import HomePage from '../pages/homepage/HomePage';
import SetCards from '../components/setCards/SetCards';
import Card from '../components/card/Card';
import NavLayout from '../layouts/NavLayout';
import Collection from '../pages/collection/Collection';
import Results from '../pages/results/Results';
import Account from '../pages/account/Account';
import {useUser} from '../stores/UserStore';
import {ReactElement} from 'react';
import Login from '../components/login/Login';
import VerifyEmail from '../components/verifyEmail/VerifyEmail.tsx';
import ForgetPassword from "../pages/forgetpassword/ForgetPassword.tsx";
import * as Sentry from "@sentry/react";

const PrivateRoute = ({children}: { children: ReactElement }) => {
    const isAuthenticated = useUser(s => s.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/home" replace/>;
    }

    return children;
};

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

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

const Router = () => {
    return <RouterProvider router={router}/>;
};

export default Router;
