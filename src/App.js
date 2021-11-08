import { Route, Switch } from "react-router";
import "./App.css";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Products />
        </Route>
          <Checkout />
        </Route>

        <Route path="/thanks">
          <Thanks />
        </Route> */}


          <Home />
        </Route> */}
      </Switch>
    </div>
  );
}

export default App;
