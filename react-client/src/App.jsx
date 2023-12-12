import NavBar from './components/NavBar';

import {Provider} from './firebase/Context';
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Provider>
    <div>
      <NavBar />
      <Outlet />
    </div>
    </Provider>
  );
}

export default App;
