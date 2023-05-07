import Home from "./components/Home";
import "./App.scss";
import AppCommon from "commons_app/AppCommon.jsx";

const App = () => (
  AppCommon ? <AppCommon projectName="Block Goals" Home={Home} /> : "Loading..."
);

export default App;
