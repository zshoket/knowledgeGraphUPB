import { combineReducers } from "redux";
import graphReducer from "./graphReducer";
import addReducer from './addReducer'

export default combineReducers({
  graphReducer,
  addReducer
});
