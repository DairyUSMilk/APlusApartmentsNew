import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import NavBar from './components/NavBar';

import {Provider} from './firebase/Context';
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Provider>
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <NavBar />
      <Outlet />
    </div>
    </Provider>
  );
}

export default App;
