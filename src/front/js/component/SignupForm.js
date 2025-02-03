import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { actions } = useContext(Context);
    let navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        let registered = await actions.signup(email, password);

        if (registered) {
            navigate("/login");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-50">
            <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </div>
            <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
    );
};

export default SignupForm;