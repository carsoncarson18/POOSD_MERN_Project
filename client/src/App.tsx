import "./App.css";
import LandingPage from "./pages/LandingPage";
// import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import ListingsPage from "./pages/ListingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/listingpage" element={<ListingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
