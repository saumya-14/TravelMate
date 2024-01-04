// import React, { useRef, useState } from 'react';
// import './login.css';
// import RoomIcon from '@mui/icons-material/Room';
// import axios from 'axios';
// import CancelIcon from '@mui/icons-material/Cancel';

// export default function Login({ setShowLogin ,myStorage,setCurrentUser}) {
//     const [error, setError] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const nameRef = useRef();
//     const passwordRef = useRef();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Login form submitted");

//         const user = {
//             username: nameRef.current.value,
//             password: passwordRef.current.value,
//         };

//         try {
//             const res = await axios.post("/users/login", user);
//             myStorage.setItem("user",res.data.username);
//             setCurrentUser(res.data.username);
//             setShowLogin(false);
//             setError(false);
            
//         } catch (err) {
//             setError(true);
//         }
//     };

//     return (
//         <div className='loginContainer'>
//             <div className="logo">
//                 <RoomIcon />
//                 TravelMate
//             </div>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" placeholder='username' ref={nameRef} />

//                 <input type="password" placeholder='password' ref={passwordRef} />
//                 <button className='loginBtn' type="submit">Login</button>

//                 {error && <span className='failure'>Something went wrong!</span>}
//                 {success && <span className='success'>Login successful!</span>}
//             </form>
//             <CancelIcon className='loginCancel' onClick={() => setShowLogin(false)} />
//         </div>
//     );
// }
import React, { useRef, useState } from 'react';
import './login.css';
import RoomIcon from '@mui/icons-material/Room';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submitted");

        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await axios.post("http://localhost:8800/api/users/login", user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);
            setSuccess(false);
        } catch (err) {
            console.error("Login error:", err.response);
            setError(true);
        }
    };

    return (
        <div className='loginContainer'>
            <div className="logo">
                <RoomIcon />
                TravelMate
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='username' ref={nameRef} />
                <input type="password" placeholder='password' ref={passwordRef} />
                <button className='loginBtn' type="submit">Login</button>

                {error && <span className='failure'>Something went wrong!</span>}
                {success && <span className='success'>Login successful!</span>}
            </form>
            <CancelIcon className='loginCancel' onClick={() => setShowLogin(false)} />
        </div>
    );
}
