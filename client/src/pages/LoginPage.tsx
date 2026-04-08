import SiteHeader from "../components/SiteHeader/SiteHeader";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import "../auth.css";

export default function LoginPage() {
    return (
        <div className="auth-page-wrapper">
            <SiteHeader />
            
            <main className="auth-main">
                <section className="auth-card">
                    <h1>Log In</h1>
                    
                    <form>
                        <label className="input-label" htmlFor="username">Username</label>
                        <input className="auth-input" type="text" id="username" name="username" />
                        
                        <label className="input-label" htmlFor="password">Password</label>
                        <input className="auth-input" type="password" id="password" name="password" />
                        
                        <button className="auth-button" type="submit">Go</button>
                    </form>
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}