import { Provider } from "react-redux";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
