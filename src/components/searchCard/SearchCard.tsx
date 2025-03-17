import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './searchCard.module.css';

const SearchCard = () => {
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/result', { state: search });

  };

  return (

    <form className={style.searchContainer} onSubmit={(e) => handleSearch(e)}>
      <input
        id="search"
        type="search"
        value={search}
        placeholder={'Search...'}
        required
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <button type="submit">
        Search
      </button>
    </form>


  );
};

export default SearchCard;
