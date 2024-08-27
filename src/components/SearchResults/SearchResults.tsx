import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
import style from "./searchResults.module.css";
import { useNavigate } from "react-router-dom";

type SearchResultsProps = {
  data: Card;
};

const SearchResults = ({ data }: SearchResultsProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={style.card}
      key={data.id}
      onClick={() => {
        navigate(`/card/${data.id}`);
      }}
    >
      <img
        className={style.cardImg}
        src={data.images.small}
        alt={`${data.name} ${data.id} Card`}
      />
    </div>
  );
};

export default SearchResults;
