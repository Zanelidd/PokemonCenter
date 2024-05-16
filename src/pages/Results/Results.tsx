import { useLocation } from "react-router-dom";
import SearchResults from "../../components/SearchResults/SearchResults";

const Results = () => {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {state.map(() => {
        return <SearchResults data={state} />;
      })}
    </>
  );
};

export default Results;
