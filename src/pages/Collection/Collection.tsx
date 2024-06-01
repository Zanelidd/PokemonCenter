import { useCollection } from "../../services/stores/CollectionStore";
import style from "./collection.module.css";

const Collection = () => {
  const { collection } = useCollection();

  return (
    <div className={style.collectionContainer}>
      {collection &&
        collection.map((card) => {
          return <h3 key={card.id}>{card.name}</h3>;
        })}
    </div>
  );
};

export default Collection;
