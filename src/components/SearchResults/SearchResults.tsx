import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
// import style from "./searchResults.module.css";

const SearchResults = (data: Card) => {
  console.log("data dans result", data);

  return (
    <div key={data.id}>
      <p>{data.name}</p>
      <p>{data.rarity}</p>;
    </div>
  );
};

export default SearchResults;
