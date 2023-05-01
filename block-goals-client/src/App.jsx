import Home from "./components/Home";
import "./App.scss";
import { urlBase } from "./components/constants";
const AppCommon = () => import(`${urlBase}/AppCommon.jsx`);

const App = () => {
//   const [AppCommon, setAppCommon] = useState(null);

//   useEffect(() => {
//     AppCommonPromise.then(module => {
//       setAppCommon(module.default);
//     });
//   }, []);

  return (
    <div>
      {AppCommon && <AppCommon projectName="Block Goals" Home={Home} />}
    </div>
  );
};

export default App;
