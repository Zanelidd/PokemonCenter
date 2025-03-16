import { Card } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import style from '../setCards/setCards.module.css';
import { useNavigate } from 'react-router-dom';

type SearchResultsProps = {
  data: Card;
};

const SearchResults = ({ data }: SearchResultsProps) => {
  const navigate = useNavigate();

  return (
    <div className={style.cardContainer}>
      <img
        className={style.card}
        key={data.id}
        onClick={() => {
          navigate(`/card/${data.id}`);
        }}
        src={data.images.small}
        alt={`image of ${data.name}`}
      />
    </div>
  );
};

export default SearchResults;
