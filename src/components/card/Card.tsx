import { useNavigate, useParams } from "react-router-dom";
import style from "./card.module.css";
import { useCollection } from "../../stores/CollectionStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import loadingGif from "/ピカチュウ-pokeball.gif";
import { useState } from "react";
import type { Attack, Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { useUser } from "../../stores/UserStore.tsx";
import api from "../../api/api.service.ts";
import { cardResponse, CollectionCard } from "../../types/card.types.ts";
import { showError, showSuccess } from "../../utils/toastUtils.ts";

const Card = () => {
  const navigate = useNavigate();
  const params = useParams();
  const cardId = params.cardId;
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const { collection, addToCollection, deleteFromCollection, getCardById } =
    useCollection();

  const isInCollection = collection.find((test) => test.id == params.cardId);

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
  const { user } = useUser();

  const mutation = useMutation({
    mutationFn: async (data: Card) => {
      if (user) {
        return api.card.addCard(user.userId, data.id);
      }
      throw new Error();
    },
    onSuccess: (result, data: Card) => {
      addToCollection(data, result.id);
      showSuccess("Cards added successfully.");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (data: CollectionCard) => {
      return api.card.deleteCard(data.id);
    },
    onSuccess: (data: cardResponse) => {
      deleteFromCollection(data.remoteId);
      showSuccess("Card delete successfully");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const handleAddCollection = (data: Card) => {
    mutation.mutate(data);
  };

  const handleDeleteCollection = (data: Card) => {
    const findCard = getCardById(data.id);
    if (findCard) {
      mutationDelete.mutate(findCard);
    } else {
      showError("Card not found in collection");
    }
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["PokemonCard", `${params.cardId}`],
    queryFn: async () => {
      if (params.cardId) {
        return await api.apiCard.getCardById(params.cardId);
      }
    },
    staleTime: twentyFourHoursInMs,
  });

  if (isPending) {
    return <img className="loadingGif" src={loadingGif} alt="Loading Gif" />;
  }

  if (error) {
    showError(error.message);
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
      <section className={style.infosContainer}>
        <div className={style.descriptions}>
          <div className={style.nameContainer}>
            <h2>{data.name}</h2>
            <h3>{data.set.name}</h3>
            <h3>{data.types}</h3>
            <h3>{data.supertype}</h3>
            {data?.evolvesFrom ? (
              <h3>Evolves from {data?.evolvesFrom}</h3>
            ) : null}
            {data?.evolvesTo ? <h3>Evolves to {data?.evolvesTo}</h3> : null}
          </div>
          <div className={style.textInfo}>
            <div className={style.attackContainer}>
              <p className={style.priceTitle}>Attacks</p>
              {data.attacks?.map((attack: Attack) => {
                return (
                  <div key={attack.text} className={style.attack}>
                    <div className={style.attackTitle}>
                      <p>{attack.name}</p>
                      <p>{attack.damage}</p>
                    </div>
                    <p>{attack.text}</p>
                  </div>
                );
              })}
            </div>
            <p>{data.flavorText}</p>
            <div className={style.priceInfo}>
              <p className={style.priceTitle}>Prices</p>
              {data?.tcgplayer?.prices.normal ? (
                <div className={style.normalPrice}>
                  <p>Low Price: {data.tcgplayer?.prices.normal?.low} $</p>
                  <p>
                    Average Price: {data.tcgplayer?.prices.normal?.market} $
                  </p>
                  <p>High Price: {data.tcgplayer?.prices.normal?.high} $</p>
                </div>
              ) : null}
              {data?.tcgplayer?.prices.holofoil ? (
                <div className={style.hollowPrice}>
                  <p>
                    Holo Low Price: {data.tcgplayer?.prices.holofoil?.low} $
                  </p>
                  <p>
                    Holo Average Price:{" "}
                    {data.tcgplayer?.prices.holofoil?.market} $
                  </p>
                  <p>
                    Holo High Price: {data.tcgplayer?.prices.holofoil?.high} $
                  </p>
                </div>
              ) : null}
              <p>
                Card number: {data.number}/{data.set.total}
              </p>
            </div>
          </div>
        </div>

        <div className={style.buttonContainer}>
          {user ? (
            isInCollection ? (
              <button
                onClick={() => {
                  cardId ? handleDeleteCollection(data) : null;
                }}
              >
                Remove from collection
              </button>
            ) : (
              <button
                onClick={() => {
                  handleAddCollection(data);
                }}
              >
                Add to collection
              </button>
            )
          ) : null}

          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
        </div>
      </section>
    </div>
  );
};

export default Card;
