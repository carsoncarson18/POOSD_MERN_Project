// AI-assisted: Implementation of login session management via localStorage, status-based UI 
// feedback for account activation, and integrated navigation for the password recovery flow

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import "../auth.css";

export default function LoginPage() {
    // Access URL parameters to check for account activation status
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, formData);

            // Saving token
            const token = response.data.token;
            localStorage.setItem("token", token);

            // Save user id
            localStorage.setItem("user", JSON.stringify({ id: response.data.user_id }));
            console.log(response.data.user_id);
            

            // Setting global header for session
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Temporary success feedback, will change later
            navigate("/neighborhoods");
            console.log("Token:", response.data.token);

        } catch (err: any) {
            let errorMessage = "Login failed";

            // Parse validation errors from backend
            if (err.response?.data?.errors) {
                const fieldErrors = err.response.data.errors.fieldErrors;
                const firstField = Object.keys(fieldErrors)[0];
                errorMessage = fieldErrors[firstField][0];
            }
            else {
                errorMessage = err.response?.data?.error || err.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <SiteHeader />

            <main className="auth-main">
                <section className="auth-card">
                    <h1>Log In</h1>

                    {status === "already_activated" && (
                        <p className="auth-status-info">
                            Your account is already active. Please log in!
                        </p>
                    )}
                    {status === "success" && (
                        <p className="auth-status-info">
                            Account verified! You can now log in
                        </p>
                    )}

                    <form className="auth-form" onSubmit={handleLogin} noValidate>
                        <div className="input-group">
                            <label className="input-label" htmlFor="username">Username</label>
                            <input
                                className="auth-input"
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">Password</label>
                            <input
                                className="auth-input"
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button type="button" className="password-button" onClick={() => navigate("/forgot-password")}>
                                Forgot password?
                            </button>
                        </div>

                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}

                        <button className="auth-button" type="submit">Go</button>
                    </form>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}