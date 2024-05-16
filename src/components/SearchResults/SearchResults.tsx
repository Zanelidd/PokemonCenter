import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
// import style from "./searchResults.module.css";

type SearchResultsProps = {
  data: Card;
};
const SearchResults = ({ data }: SearchResultsProps) => {
  return (
    <div key={data.id}>
      <p>{data.name}</p>
      <p>{data.rarity}</p>;
    </div>
  );
};

export default SearchResults;
