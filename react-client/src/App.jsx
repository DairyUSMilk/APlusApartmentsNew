import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      Hello world, this is ultra minimal Vite React!
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <Outlet />
    </div>
  );
}

export default App;
