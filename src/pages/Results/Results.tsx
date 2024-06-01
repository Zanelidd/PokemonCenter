import { useLocation } from "react-router-dom";
import SearchResults from "../../components/SearchResults/SearchResults";
import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";
import style from "./result.module.css";

const Results = () => {
  const location = useLocation();
  const state = location.state;

  return (
    <div className={style.resultContainer}>
      {state.map((stat: Card) => {
        return <SearchResults key={stat.id} data={stat} />;
      })}
    </div>
  );
};

export default Results;
