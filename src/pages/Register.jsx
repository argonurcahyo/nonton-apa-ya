import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../apis/firebase'

const Register = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget)
        const email = data.get('email')
        const password = data.get('password')

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            console.log(user);
            navigate("/")
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input type="email" name="email" id="email" placeholder='Email' />
                </div>
                <div className="input-wrapper">
                    <input type="password" name="password" id="password" placeholder='Password' />
                </div>
                <button type="submit" className='btn'>Register</button>
                <div style={{ color: "red" }}>{errorMessage}</div>
            </form>
        </div>
    )
}

export default Register