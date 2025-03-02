import { useCollection } from '../../services/stores/CollectionStore';
import style from './collection.module.css';
import SearchResults from '../../components/SearchResults/SearchResults.tsx';


const Collection = () => {
  const { collection } = useCollection();


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

    </div>
  );
};

export default Collection;
