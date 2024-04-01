import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Set } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { useEffect, useState } from "react";
import style from "./homePage.module.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [pokemonSets, setPokemonSets] = useState<Set[]>();
  useEffect(() => {
    PokemonTCG.getAllSets().then((res) => {
      setPokemonSets(res);
    });
  }, []);

  return (
    <div className={style.setContainer}>
      {pokemonSets?.map((set) => {
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
