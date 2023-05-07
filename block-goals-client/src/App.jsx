import Home from "./components/Home";
import "./App.scss";
import { AppCommon } from "Commons";

const App = () => (
  AppCommon ? <AppCommon projectName="Block Goals" Home={Home} /> : "Loading..."
);

export default App;
