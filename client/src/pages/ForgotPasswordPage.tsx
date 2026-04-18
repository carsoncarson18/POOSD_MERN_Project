import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import "../auth.css";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please insert a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/forgotPassword`, { email });
            
            setMessage(response.data.message);
        } catch (err: any) {
            let errorMessage = "Something went wrong. Please try again";

            if (err.response?.data?.errors) {
                const fieldErrors = err.response.data.errors.fieldErrors;
                const firstField = Object.keys(fieldErrors)[0];
                errorMessage = fieldErrors[firstField][0];
            } else {
                errorMessage = err.response?.data?.error || err.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <SiteHeader />
            
            <main className="auth-main">
                <section className="auth-card">
                    <h1>Reset Password</h1>
                    <p className="auth-instruction">
                        Enter your email address and we'll send you a link to reset your password
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <div className="input-group">
                            <label className="input-label" htmlFor="email">Email Address</label>
                            <input 
                                className="auth-input" 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="password-button" 
                                onClick={() => navigate("/login")}
                            >
                                Go back
                            </button>
                        </div>
                        
                        {error && <p className="auth-error">{error}</p>}
                        {message && <p className="auth-reset-info">{message}</p>}

                        <button 
                            className="auth-button" 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}