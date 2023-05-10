import Home from "Components/Home";
import "./App.scss";
import AppCommon from "Commons/AppCommon";

import config from "Assets/ContractABI.json"
import contractAddresses from "Assets/ContractAddresses.json"

const App = () => (
  <AppCommon projectName="Block Goals" Home={Home} config={config} contractAddresses={contractAddresses} />
);

export default App;
