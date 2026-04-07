import styles from "./SiteHeader.module.css"

export default function SiteHeader()
{

    return (
        <header id="site-header" className={styles.header}>
            <h1><a href="">Scraps</a></h1>
            <nav>
                <ul>
                    <li>
                        <a href="">Log In</a>
                    </li>
                    <li>
                        <a href="">Sign Up</a>
                    </li>
                    <li>
                        <a href="">About Us</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}