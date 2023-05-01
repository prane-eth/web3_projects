import { useState } from "react";
import { UseWalletProvider } from 'use-wallet'

import Home from "./components/Home";
import { urlBase } from "./components/constants";
import { AppCommon } from `${urlBase}/AppCommon.jsx`;
import "./App.scss";

const App = () => (
	<AppCommon projectName="Block Goals" Home={Home} />
);
export default App;
