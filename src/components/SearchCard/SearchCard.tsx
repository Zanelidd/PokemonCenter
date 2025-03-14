import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './searchCard.module.css';

const SearchCard = () => {
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/result", { state: search });
  };

  return (
    <div className={style.searchContainer}>
      <input
        id="search"
        type="search"
        value={search}
        placeholder={"Search..."}
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
