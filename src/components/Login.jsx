import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import { auth } from '../apis/firebase'

const Login = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        const data = new FormData(event.currentTarget);
        const email = data.get('email')
        const password = data.get('password')

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <div className="container">
            {loading && "Loading..."}
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input type="email" name="email" id="email" placeholder='Email' />
                </div>
                <div className="input-wrapper">
                    <input type="password" name="password" id="password" placeholder='Password' />
                </div>
                <button type="submit" className='btn'>Login</button>
                <div style={{ color: "red" }}>{errorMessage}</div>
            </form>
        </div>
    )
}

export default Login