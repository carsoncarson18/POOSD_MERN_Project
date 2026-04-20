import styles from "./SiteFooter.module.css"


export default function SiteFooter()
{

    return (
        <footer className={styles.footer}>
            <p style={{color:'white',width:'fit-content',whiteSpace:'nowrap'}}>© 2026 Scraps | All Rights Reserved</p>
            <nav style={{}}>
                <ul>
                    <li>
                        <a href="/about">About Us</a>
                    </li >
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                    {/* <li>
                        <a href="">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="">Terms of Use</a>
                    </li> */}
                </ul>
            </nav>
        </footer>
    );
}