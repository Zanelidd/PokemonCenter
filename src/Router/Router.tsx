import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Homepage/HomePage";
import SetCards from "../components/setCards/SetCards";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import Card from "../components/Card/Card";
import NavLayout from "../Layouts/NavLayout";
import Collection from "../pages/Collection/Collection";

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
          loader: async ({ params }) => {
            return PokemonTCG.findCardsByQueries({
              q: `set.id:${params.setId}`,
            });
          },
        },
        {
          path: "/card/:cardId",
          element: <Card />,
          loader: async ({ params }) => {
            return PokemonTCG.findCardByID(`${params.cardId}`);
          },
        },
        { path: "/collection", element: <Collection /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
