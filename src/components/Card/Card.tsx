import { useLoaderData, useNavigate } from "react-router-dom";
import { Card as ICard } from "../../services/types/type";
import style from "./card.module.css";
import { useCollection } from "../../services/stores/CollectionStore";

const Card = () => {
  const card = useLoaderData() as ICard;
  const navigate = useNavigate();

  const { collection, addToCollection, deleteFromCollection } = useCollection();

  const isInCollection = collection.find((test) => test.id == card.id);

  return (
    <div className={style.cardInfoContainer}>
      <img className={style.cardImg} src={card.images.large} alt="" />
      <div className={style.infosContainer}>
        <p>{card.flavorText}</p>
        <p>Rarity : {card.rarity}</p>
        <p>Card number : {card.number}</p>
        <p>Average Price : {card.cardmarket.prices.trendPrice} $ </p>
        <div className={style.buttonContainer}>
          {isInCollection ? (
            <button
              onClick={() => {
                deleteFromCollection(card.id);
              }}
            >
              Delete from colleciton
            </button>
          ) : (
            <button
              onClick={() => {
                addToCollection(card);
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
