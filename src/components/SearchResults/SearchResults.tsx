import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
import style from "./searchResults.module.css";

type SearchResultsProps = {
  data: Card;
};
const SearchResults = ({ data }: SearchResultsProps) => {
  return (
    <div className={style.card} key={data.id}>
      <img className={style.cardImg} src={data.images.large} alt="" />
    </div>
  );
};

export default SearchResults;
