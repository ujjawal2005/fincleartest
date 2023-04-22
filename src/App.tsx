import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Pages/Home";
import { ViewShare } from "./components/Pages/Viewshare";
import { Buysell } from "./components/Pages/Buysell";
import { History } from "./components/Pages/History";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/viewshare" element={<ViewShare />} />
            <Route path="/buysell" element={<Buysell />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
