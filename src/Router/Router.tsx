import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/Homepage/HomePage';
import SetCards from '../components/setCards/SetCards';
import Card from '../components/Card/Card';
import NavLayout from '../Layouts/NavLayout';
import Collection from '../pages/Collection/Collection';
import Results from '../pages/Results/Results';
import Account from '../pages/Account/Account';
import { useUser } from '../services/stores/UserStore';
import { useCollection } from '../services/stores/CollectionStore.tsx';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};



const Router = () => {
  const { fillCollection } = useCollection();
  const { getUser } = useUser();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavLayout />,
      children: [
        { path: "/home", element: <HomePage /> },
        {
          path: "/:setId",
          element: <SetCards />,
        },
        {
          path: "/card/:cardId",
          element: <Card />,
        },
        { path: "/result", element: <Results /> },
        {
          path: "/user",
          children: [
            {
              path: "/user/collection",
              element: (
                <PrivateRoute>
                  <Collection />
                </PrivateRoute>
              ),
              loader: async () => {
                const currentUser = getUser();

                if (currentUser?.userId) {
                  return fillCollection(currentUser.userId);
                }

                // Si pas d'utilisateur, retournez null
                return null;
              }
            },
            {
              path: "/user/account",
              element: (
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
