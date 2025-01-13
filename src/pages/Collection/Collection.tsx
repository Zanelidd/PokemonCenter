import { useCollection } from "../../services/stores/CollectionStore";
import style from "./collection.module.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../services/stores/UserStore.tsx";

const Collection = () => {
  const { collection, fillCollection } = useCollection();
  const { user } = useUser();

  const navigate = useNavigate();

  const handleClickCollection = (cardId: string) => {
    return navigate(`/card/${cardId}`);
  };

  return (
    <div className={style.collectionContainer}>
      {collection &&
        collection.map((card) => {
          return (
            <div key={card.id}>
              <h3 onClick={() => handleClickCollection(card.id)}>
                {card.name}
              </h3>
            </div>
          );
        })}
      <button onClick={() => fillCollection(user?.userId)}>
        fill collection
      </button>
    </div>
  );
};

export default Collection;
