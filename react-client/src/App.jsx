import NavBar from './components/NavBar';

import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

import { Outlet } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div>
          <NavBar />
          <Outlet />
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
