import { useCollection } from "../../services/stores/CollectionStore";

const Collection = () => {
  const { collection } = useCollection();

  return (
    <>
      {collection &&
        collection.map((card) => {
          return <h3>{card.name}</h3>;
        })}
    </>
  );
};

export default Collection;
