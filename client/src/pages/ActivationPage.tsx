import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import "../auth.css";

export default function ActivationPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    // Prevent duplicate API calls in React Strict Mode or during re-renders
    const hasCalledProvider = useRef(false);

    useEffect(() => {
        if (hasCalledProvider.current) return;
        hasCalledProvider.current = true;

        const activateAccount = async () => {
            try {
                // Trigger backend email verification via the URL token
                await axios.get(`${import.meta.env.VITE_API_URL}/api/activate/${token}`);

                // Direct to login on successful activation
                navigate("/login?status=success");
            } catch (err: any) {
                // Handle cases where the account is already verified to prevent redundant errors
                if (err.response?.data?.message === "Account already activated!") {
                    navigate("/login?status=already_activated");
                } else {
                    setError("Activation failed. The link may be expired or invalid.");
                }
            }
        };

        if (token) activateAccount();
    }, [token, navigate]);

    return (
        <div className="auth-page-wrapper">
            <SiteHeader />
            
            <main className="auth-main">
                <section className="auth-card activation-card">
                    {/* Display error message if request fails; otherwise show loading state */}
                    {error ? (
                        <p className="auth-error">
                            {error}
                        </p>
                    ) : (
                        <p className="auth-loading-text">Activating your account...</p>
                    )}
                </section>
            </main>
            
            <SiteFooter />
        </div>
    );
}