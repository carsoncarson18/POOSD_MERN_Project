import { Link } from "react-router-dom";
import styles from "./SiteHeader.module.css"

export default function SiteHeader()
{

    return (
        <header className={styles.siteHeader}>
            <h1><Link to="/">Scraps</Link></h1>
            <nav>
                <ul>
                    <li>
                        <Link to ="/login">Log In</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign Up</Link>
                    </li>
                    <li>
                        <Link to="/about">About Us</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}