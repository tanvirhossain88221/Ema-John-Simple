import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { handleGoogleSignIn, initializeLoginFrameWork, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';


function Login() {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: ''
    });

    initializeLoginFrameWork();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };


    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const fbSignIn = () => {
        handleFbSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const signOut = () => {
        handleSignOut()
            .then(res => {
                handleResponse(res, false);
            })
    }


    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        if (redirect) {
            history.replace(from);
        }
    }







    const handleBlur = (e) => {
        let isFromValid = true;
        if (e.target.name === 'email') {
            isFromValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value);
            isFromValid = isPasswordValid && passwordHasNumber
        }
        if (isFromValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
        }
    }
    const handleSubmit = (e) => {
        if (newUser && user.name && user.password) {
            createUserWithEmailAndPassword(user.email, user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                })
        }


        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                })
        }
        e.preventDefault();
    }


    return (
        <div className="App">
            {
                user.isSignedIn ? <button onClick={signOut}>Sine Out</button> :
                    <button onClick={googleSignIn}>Sign In</button>
            } <br />
            <button onClick={fbSignIn}>Sign in using Facebook</button>
            {
                user.isSignedIn &&
                <div>
                    <p>Welcome, {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }
            <h1>Our Own Authentication</h1>
            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
            <label htmlFor="newUser">New User Sign Up</label>
            <form onSubmit={handleSubmit}>
                {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Name" />} <br />
                <input type="text" onBlur={handleBlur} name="email" placeholder="Email" required /> <br />
                <input type="password" onBlur={handleBlur} name="password" placeholder="Password" required /> <br />
                <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
            </form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} SuccessFully</p>}
        </div >
    );
}

export default Login;