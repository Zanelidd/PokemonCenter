import { useNavigate, useParams } from "react-router-dom";
import style from "./card.module.css";
import { useCollection } from "../../services/stores/CollectionStore";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { useQuery } from "@tanstack/react-query";
import loadingGif from "/ピカチュウ-pokeball.gif";
import { useState } from "react";

const Card = () => {
  const navigate = useNavigate();
  const params = useParams();
  const cardId = params.cardId;
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const { collection, addToCollection, deleteFromCollection } = useCollection();

  const isInCollection = collection.find((test) => test.id == params.cardId);

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const { isPending, error, data } = useQuery({
    queryKey: ["PokemonCard", `${params.cardId}`],
    queryFn: () => {
      return PokemonTCG.findCardByID(`${params.cardId}`);
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
    <div className={style.cardInfoContainer}>
      <div className={style.card}>
        <div
          className={style.imgContainer}
          onMouseMove={(e) => {
            const elRect = (e.target as HTMLDivElement).getBoundingClientRect();

            const root = document.documentElement;
            const x = Math.round(e.clientX - elRect.left);
            const y = Math.round(e.clientY - elRect.top);
            const midCardWidth = elRect.width / 2;
            const midCardHeight = elRect.height / 2;
            const xAxis = Math.round((y - midCardHeight) / 8);
            const yAxis = -Math.round((x - midCardWidth) / 8);

            setCoord({
              x: Math.round(e.clientX / 10),
              y: Math.round(e.clientY / 10),
            });

            root.style.setProperty("--xAxis", `${xAxis}deg`);
            root.style.setProperty("--yAxis", `${yAxis}deg`);
            root.style.setProperty("--mouseX", `${coord.x}%`);
            root.style.setProperty("--mouseY", `${coord.y}%`);
          }}
          onMouseLeave={() => {
            const root = document.documentElement;

            root.style.setProperty("--xAxis", `0 deg`);
            root.style.setProperty("--yAxis", `0 deg`);
            root.style.setProperty("--o", "1");
          }}
        >
          <img className={style.cardImg} src={data.images.large} alt="" />
        </div>
      </div>
      <div className={style.infosContainer}>
        <p>{data.flavorText}</p>
        <p>Rarity : {data.rarity}</p>
        <p>Card number : {data.number}</p>
        <p>Average Price : {data.cardmarket.prices.trendPrice} </p>
        <div className={style.buttonContainer}>
          {isInCollection ? (
            <button
              onClick={() => {
                cardId ? deleteFromCollection(cardId) : null;
              }}
            >
              Delete from colleciton
            </button>
          ) : (
            <button
              onClick={() => {
                addToCollection(data);
              }}
            >
              Add to my collection
            </button>
          )}
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
