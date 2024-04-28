import { GET_POKEMON, GET_POKEMON_TYPES } from "./actionTypes";

const initialState: PokemonState = {
  pokemons: [],
  pokemonTypes: [],
};

const reducer = (
  state: PokemonState = initialState,
  action: PokemonAction
): PokemonState => {
  switch (action.type) {
    case GET_POKEMON:
      return {
        ...state,
        pokemons: action.payload,
      };
    case GET_POKEMON_TYPES:
      return {
        ...state,
        pokemonTypes: action.payload,
      };
  }
  return state;
};

export default reducer;
