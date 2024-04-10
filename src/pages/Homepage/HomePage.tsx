import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import style from "./homePage.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import loadingGif from "/ピカチュウ-pokeball.gif";

const HomePage = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   PokemonTCG.getAllSets().then((res) => {
  //     setPokemonSets(res);
  //   });
  // }, []);

  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

  const { isPending, error, data } = useQuery({
    queryKey: ["PokemonSet"],
    queryFn: () => {
      return PokemonTCG.getAllSets();
    },
    staleTime: twentyFourHoursInMs,
  });

  if (isPending) {
    return (
      <img className={style.loadingGif} src={loadingGif} alt="Loading Gif" />
    );
  }

  if (error) {
    return "An error occured: " + error.message;
  }

  return (
    <div className={style.setContainer}>
      {data?.map((set) => {
        return (
          <div
            key={set.id}
            className={style.setCard}
            onClick={() => {
              navigate(`/${set.id}`);
            }}
          >
            <h3 className={style.setName}>{set.name}</h3>
            <img className={style.setImg} src={set.images.logo} />
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
