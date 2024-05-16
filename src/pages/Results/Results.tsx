import { useLocation } from "react-router-dom";
import SearchResults from "../../components/SearchResults/SearchResults";
import { Card } from "pokemon-tcg-sdk-typescript/dist/sdk";

const Results = () => {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {state.map((stat: Card) => {
        return <SearchResults data={stat} />;
      })}
    </>
  );
};

export default Results;
