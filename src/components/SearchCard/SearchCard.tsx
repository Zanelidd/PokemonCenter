import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { useState } from "react";
import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { useNavigate } from "react-router-dom";
import style from "./searchCard.module.css";

const SearchCard = () => {
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<Card[]>([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    PokemonTCG.findCardsByQueries({ q: `name:${search}` }).then((cards) => {
      setResult(cards);
      navigate("/result", { state: result });
    });
  };

  return (
    <div className={style.searchContainer}>
      <input
        type="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <button
        onClick={() => {
          handleSearch();
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchCard;
