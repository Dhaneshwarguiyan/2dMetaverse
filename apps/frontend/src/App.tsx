import "./App.css";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LoggedIn from "./layouts/LoggedIn";
import Metaverse from "./pages/Metaverse";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Space from "./pages/Space";
import Navigate from "./pages/Navigate";

function App() {
  return (
    <div className="w-screen h-screen overflow-scroll">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<LoggedIn />}>
              {/* maps can be selected here and user infos */}
              <Route index element={<Space />} />
              {/* you choose your avatar */}
              <Route path="/home/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
          <Route path="/meta" element={<Metaverse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
