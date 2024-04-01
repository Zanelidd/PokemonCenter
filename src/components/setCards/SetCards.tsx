import { useLoaderData, useNavigate } from "react-router-dom";
import style from "./setCards.module.css";
import { Card } from "../../services/types/type";

const SetCards = () => {
  const cards = useLoaderData() as Card[];
  const navigate = useNavigate();
  console.log(cards);

  return (
    <div className={style.cardContainer}>
      {cards.map((card: Card) => {
        return (
          <div
            className={style.card}
            key={card.id}
            onClick={() => {
              navigate(`/card/${card.id}`);
            }}
          >
            <img src={card.images.small} alt="" />
          </div>
        );
      })}
    </div>
  );
};

export default SetCards;
