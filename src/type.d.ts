interface IPokemon {
  name: string;
  url: string;
}

type PokemonState = {
  pokemons: IPokemon[];
  pokemonTypes: IPokemon[];
};

type PokemonAction = {
  type: string;
  payload: IPokemon[];
};

type DispatchType = (args: PokemonAction) => PokemonAction;
