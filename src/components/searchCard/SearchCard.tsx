import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./searchCard.module.css";
import { showWarning } from "../../utils/toastUtils";

const SearchCard = () => {
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search.trim().length < 2) {
      showWarning("Please enter at least 2 characters");
      return;
    }

    navigate("/result", { state: search.trim() });
  };

  return (
    <form className={style.searchContainer} onSubmit={handleSearch}>
      <input
        id="search"
        type="search"
        value={search}
        placeholder={"Search for a card..."}
        required
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <button type="submit" className={style.searchButton}>Search</button>
    </form>
  );
};

export default SearchCard;
