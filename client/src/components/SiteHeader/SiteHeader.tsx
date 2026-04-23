import { Link, useNavigate } from "react-router-dom";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className={styles.siteHeader}>
            <h1><Link to="/">Scraps</Link></h1>
            <nav>
                <ul>
                    {!token ? (
                        <>
                            <li><Link to="/login">Log In</Link></li>
                            <li><Link to="/signup">Sign Up</Link></li>
                        </>
                    ) : (
                        <li>
                            <button onClick={handleLogout}>Log Out</button>
                        </li>
                    )}
                    <li><Link to="/about">About Us</Link></li>
                </ul>
            </nav>
        </header>
    );
}