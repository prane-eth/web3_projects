import Home from "./components/Home";
import "./App.scss";
import { getCommons } from "./components/constants";
const { AppCommon } = getCommons();

import config from "./assets/ContractABI.json"
import contractAddresses from "./assets/ContractAddresses.json"

const App = () => (
  <AppCommon projectName="Block Goals" Home={Home} config={config} contractAddresses={contractAddresses} />
);

export default App;
