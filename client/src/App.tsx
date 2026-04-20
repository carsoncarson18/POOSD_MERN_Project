import AboutPage from './pages/about/AboutPage'
import "./App.css";
import LandingPage from "./pages/LandingPage";
// import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import ActivationPage from './pages/ActivationPage'
import ListingsPage from "./pages/ListingsPage";
import Contact from './pages/contact/Contact';
import NeighborHoodsPage from './pages/neighborhoods/NeighborhoodsPage';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import axios from 'axios';

// Check if a user was already logged in
const savedToken = localStorage.getItem("token");
if (savedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path='/about' element={<AboutPage/>}/>

        <Route path='/contact' element={<Contact/>}/>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/neighborhoods" element={<NeighborHoodsPage/>} />

        <Route path="/activate/:token" element={<ActivationPage />} />

        <Route path="/listingpage" element={<ListingsPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
