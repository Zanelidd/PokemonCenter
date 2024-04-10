import { useNavigate, useParams } from "react-router-dom";
import style from "./setCards.module.css";
import { useQuery } from "@tanstack/react-query";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import loadingGif from "/ピカチュウ-pokeball.gif";
import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";

const SetCards = () => {
  const navigate = useNavigate();
  const params = useParams();

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const { isPending, error, data } = useQuery({
    queryKey: ["SetCard", `${params.setId}`],
    queryFn: () => {
      return PokemonTCG.findCardsByQueries({
        q: `set.id:${params.setId}`,
      });
    },
    staleTime: twentyFourHoursInMs,
  });

  if (isPending) {
    return (
      <img className={style.loadingGif} src={loadingGif} alt="Loading Gif" />
    );
  }

  if (error) {
    return "An error occured: " + error.message;
  }

  return (
    <div className={style.cardContainer}>
      {data.map((card: Card) => {
        return (
          <img
            className={style.card}
            key={card.id}
            onClick={() => {
              navigate(`/card/${card.id}`);
            }}
            src={card.images.small}
            alt={`image of ${card.name}`}
          />
        );
      })}
    </div>
  );
};

export default SetCards;
