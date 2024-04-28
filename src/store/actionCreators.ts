import { GET_POKEMON, GET_POKEMON_TYPES } from "./actionTypes";
import { callAPIInterface } from "../utils/constants";

export const setPokemon = (data: IPokemon[]) => (dispatch: DispatchType) => {
  const action: PokemonAction = {
    type: GET_POKEMON,
    payload: data,
  };
  dispatch(action);
};

export const getPokemonTypes = () => (dispatch: DispatchType) => {
  callAPIInterface({
    method: "GET",
    path: `/type`,
  }).then((res: any) => {
    const results: IPokemon[] = res.results;
    const action: PokemonAction = {
      type: GET_POKEMON_TYPES,
      payload: results,
    };
    dispatch(action);
  });
};

export const getPokemonByType =
  (type: string, signal: any) => (dispatch: DispatchType) => {
    callAPIInterface({
      method: "GET",
      path: `/type/${type}`,
      signal,
    }).then((res: any) => {
      const results: IPokemon[] =
        res?.pokemon?.length > 0 &&
        res.pokemon.map((item: any) => {
          return item.pokemon;
        });
      const action: PokemonAction = {
        type: GET_POKEMON,
        payload: results,
      };
      dispatch(action);
    });
  };
