import SiteHeader from "../components/SiteHeader/SiteHeader";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import "../auth.css";

export default function SignupPage() {
    return (
        <div className="auth-page-wrapper">
            <SiteHeader />
            
            <main className="auth-main">
                <section className="auth-card">
                    <h1>Sign Up</h1>
                    
                    <form>
                        <label className="input-label" htmlFor="tel">First Name</label>
                        <input className="auth-input" type="text" id="firstname" name="firstname" required />

                        <label className="input-label" htmlFor="email">Email</label>
                        <input className="auth-input" type="email" id="email" name="email" required />

                        <label className="input-label" htmlFor="username">Username</label>
                        <input className="auth-input" type="text" id="username" name="username" required />
                        
                        <label className="input-label" htmlFor="password">Password</label>
                        <input className="auth-input" type="password" id="password" name="password" required />
                        
                        <button className="auth-button" type="submit">Go</button>
                    </form>
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}