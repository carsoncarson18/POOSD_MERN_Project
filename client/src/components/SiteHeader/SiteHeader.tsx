import styles from "./SiteHeader.module.css"
import { Link } from "react-router-dom"

export default function SiteHeader()
{

    return (
        <header id="site-header" className={styles.header}>
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
                        <a href="">About Us</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}