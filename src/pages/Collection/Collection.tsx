import { useCollection } from '../../services/stores/CollectionStore';
import style from './collection.module.css';
import { useUser } from '../../services/stores/UserStore.tsx';
import SearchResults from '../../components/SearchResults/SearchResults.tsx';


const Collection = () => {
  const { collection, fillCollection } = useCollection();
  const { user } = useUser();

  return (
    <div className={style.collectionContainer}>
      <div className={style.collectionCardContainer}>

      {collection &&
       collection.map((card) => {

          return (
            <SearchResults key={card.id} data={card}/>
          );
        })
      }
      </div>

      <button onClick={() => fillCollection(user?.userId)}>
        fill collection
      </button>
    </div>
  );
};

export default Collection;
