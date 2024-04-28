import { createStore, applyMiddleware, Store } from "redux";
import reducer from "./reducer";
import { thunk } from "redux-thunk";

const store: Store<PokemonState, PokemonAction> & {
  dispatch: DispatchType;
} = createStore(reducer, applyMiddleware(thunk));

export default store;
