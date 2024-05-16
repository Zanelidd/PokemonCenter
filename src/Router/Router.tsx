import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Homepage/HomePage";
import SetCards from "../components/setCards/SetCards";
import Card from "../components/Card/Card";
import NavLayout from "../Layouts/NavLayout";
import Collection from "../pages/Collection/Collection";
import Results from "../pages/Results/Results";

const Router = () => {
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
        { path: "/collection", element: <Collection /> },
        { path: "/result", element: <Results /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
