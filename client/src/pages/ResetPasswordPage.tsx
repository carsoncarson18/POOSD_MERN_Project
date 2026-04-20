import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import "../auth.css";

export default function ResetPasswordPage() {
    const { token } = useParams(); // Grabs the JWT from the URL
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        // Manually checking for mandatory stuff
        if (!password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password.length > 72) {
            setError("Password must not exceed 72 characters");
            return; 
        }

        setIsLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/resetPassword`, {
                token,
                password
            });

            setMessage("Password has successfully been reset!");
            setTimeout(() => navigate("/login"), 3000);

        } catch (err: any) {
            let errorMessage = "Failed to reset password. The link may be expired.";
            const responseData = err.response?.data;

            if (responseData?.errors) {
                const { fieldErrors, formErrors } = responseData.errors;

                if (fieldErrors && Object.keys(fieldErrors).length > 0) {
                    const firstField = Object.keys(fieldErrors)[0];
                    errorMessage = fieldErrors[firstField][0];
                } 
                else if (formErrors && formErrors.length > 0) {
                    errorMessage = formErrors[0];
                }
            } 
            else if (responseData?.error) {
                errorMessage = responseData.error;
            } 
            else if (responseData?.message) {
                errorMessage = responseData.message;
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
                    <h1>New Password</h1>
                    <p className="auth-instruction">Enter your new password below</p>

                    <form className="auth-form" onSubmit={handleReset} noValidate>
                        <div className="input-group">
                            <label className="input-label" htmlFor="password">New Password</label>
                            <input 
                                className="auth-input" 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                className="auth-input" 
                                type="password" 
                                id="confirmPassword" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        
                        {error && <p className="auth-error">{error}</p>}
                        {message && <p className="auth-reset-info">{message}</p>}

                        <button className="auth-button" type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}