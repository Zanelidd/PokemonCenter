import { useNavigate, useParams } from 'react-router-dom';
import style from './card.module.css';
import { useCollection } from '../../services/stores/CollectionStore';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { useMutation, useQuery } from '@tanstack/react-query';
import loadingGif from '/ピカチュウ-pokeball.gif';
import { useState } from 'react';
import type { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { CollectionCard } from '../../services/types';
import { useUser } from '../../services/stores/UserStore.tsx';

const Card = () => {
  const navigate = useNavigate();
  const params = useParams();
  const cardId = params.cardId;
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const { collection, addToCollection, deleteFromCollection, getCardById } =
    useCollection();

  const isInCollection = collection.find((test) => test.id == params.cardId);

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
  const { user,logout} = useUser();

  const mutation = useMutation({
    mutationFn: async (data: Card) => {
      return await fetch(`${import.meta.env.VITE_BACKEND_URL}/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.access_token}`
        },

        body: JSON.stringify({
          cardId: data.id,
          userId: user?.userId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          return result;
        })

    },
    onSuccess: (result,data : Card) => {
      addToCollection(data, result.id)

      //ajout toaster avec sonner
    },
    onError: (error) => {
      console.error("Error", error.message);
      logout()

    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (data: CollectionCard) => {
      return await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/card/${data.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.access_token}`
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((result) => {

          return result;
        })

    },
    onSuccess: (data) => {
      deleteFromCollection(data.remoteId);
      //ajout toaster avec sonner
    },
    onError: (error) => {
      console.error("Error", error);
      logout()
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
      console.error("Card not found in collection");
    }
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["PokemonCard", `${params.cardId}`],
    queryFn: () => {
      return PokemonTCG.findCardByID(`${params.cardId}`);
    },
    staleTime: twentyFourHoursInMs,
  });

  if (isPending) {
    return <img className="loadingGif" src={loadingGif} alt="Loading Gif" />;
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
      <section className={style.infosContainer}>
        <div className={style.descriptions}>
        <div className={style.nameContainer}>
          <h2>{data.name}</h2>
          <h3>{data.set.name}</h3>
          <h3>{data.types}</h3>
          <h3>{data.supertype}</h3>
          {data?.evolvesFrom ? <h3>Evolves from {data?.evolvesFrom}</h3> : null}
          {data?.evolvesTo ? <h3>Evolves to {data?.evolvesTo}</h3> : null }

        </div>
        <div className={style.textInfo}>
          <div className={style.attackContainer}>
            <p className={style.priceTitle}>Attacks</p>
            {data.attacks?.map((attack) => {
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
            {data?.tcgplayer?.prices.normal ? <div className={style.normalPrice}>
              <p>Low Price : {data.tcgplayer?.prices.normal?.low} $ </p>
              <p>Average Price : {data.tcgplayer?.prices.normal?.market} $</p>
              <p>High Price : {data.tcgplayer?.prices.normal?.high} $ </p>
            </div> : null}
            {data?.tcgplayer?.prices.holofoil ? <div className={style.hollowPrice}>
              <p>Hollow Low Price : {data.tcgplayer?.prices.holofoil?.low} $</p>
              <p>
                Hollow Average Price : {data.tcgplayer?.prices.holofoil?.market}
                $
              </p>
              <p>
                Hollow High Price : {data.tcgplayer?.prices.holofoil?.high} $
              </p>
            </div> : null}
            <p>
              Card number : {data.number}/{data.set.total}
            </p>
          </div>
        </div>
        </div>

        <div className={style.buttonContainer}>
          {user ?  isInCollection ? (
              <button
                onClick={() => {
                  cardId ? handleDeleteCollection(data) : null;
                }}
              >
                Delete from collection
              </button>
            ) : (
              <button
                onClick={() => {
                  handleAddCollection(data);
                }}
              >
                Add to my collection
              </button>
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
