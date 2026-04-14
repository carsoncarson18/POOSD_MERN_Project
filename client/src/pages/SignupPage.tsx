import { useState } from "react";
import axios from "axios";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import "../auth.css";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        username: "",
        password: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Update state dynamically based on the input field's "name" attribute
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Send user registration data to the backend API
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/signup`, formData);

            setSuccess(response.data.message);
        } catch (err: any) {
            let errorMessage = "Signup failed";
            
            // Extract the first specific validation error if validation fails on the backend
            if (err.response?.data?.errors) {
                const fieldErrors = err.response.data.errors;
                const firstField = Object.keys(fieldErrors)[0];
                errorMessage = fieldErrors[firstField][0]; 
            } 
            else {
                errorMessage = err.response?.data?.error || err.response?.data?.message || errorMessage;
            }
            
            setError(errorMessage);
        }
    }

    return (
        <div className="auth-page-wrapper">
            <SiteHeader />
            
            <main className="auth-main">
                <section className="auth-card">
                    <h1>Sign Up</h1>
                    
                    <form className="auth-form" onSubmit={handleSignup} noValidate>
                        <div className="input-group">
                            <label className="input-label" htmlFor="firstName">First Name</label>
                            <input className="auth-input" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="email">Email</label>
                            <input className="auth-input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="username">Username</label>
                            <input className="auth-input" type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">Password</label>
                            <input className="auth-input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        
                        {/* Display feedback messages to the user */}
                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p className="auth-success">
                                {success}
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