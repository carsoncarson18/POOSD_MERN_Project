import AboutPage from './pages/about/AboutPage'
import "./App.css";
import LandingPage from "./pages/LandingPage";
// import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import ActivationPage from './pages/ActivationPage'
import ListingsPage from "./pages/ListingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path='/about' element={<AboutPage/>}/>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/activate/:token" element={<ActivationPage />} />

        <Route path="/listingpage" element={<ListingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
