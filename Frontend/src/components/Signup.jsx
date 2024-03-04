import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

function SignUp() {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState("password")

    const [form, setForm] = useState({
        email: "",
        password: "",
        cpassword: "",

    });

    const { darkMode } = useTheme();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        setTimeout(async () => {
            try {

                const res = await axios.post('http://localhost:4000/signup', {
                    ...form
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (res.data.errors.email) {
                    toast.error(res.data.errors.email)
                }

                if (res.data.errors.password) {
                    toast.error(res.data.errors.password)
                }



            } catch (error) {

                toast.error(error);

            }
            finally {
                setLoading(false)
            }
        }, 500);
    };

    return (
        <div className={`flex h-screen flex-grow justify-center items-center text-lg ${darkMode ? 'bg-[#121212]' : 'bg-[#F1F3F4]'}`}>

            <form
                className={`flex flex-col pt-10 pb-10 p-5 space-y-5 rounded-md ${darkMode ? 'bg-[#1e1e1e]' : 'bg-white'} shadow hover:shadow-md duration-200 ease-in-out 
                    lg:w-[22vw]`}
                onSubmit={handleSubmit}
            >

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className='outline-none p-1 border rounded-md pl-2'
                    placeholder="Email"
                    required
                />

                <div className='flex justify-between space-x-2 pr-2 border items-center rounded-md'>
                    <input
                        type={show}
                        name="password"
                        className='outline-none p-1 pl-2 w-full rounded-md rounded-r-none'
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        autoComplete="true"
                    />

                    <div
                        className={`cursor-pointer ${darkMode ? 'text-white' : 'text-gray-400'}`}
                        onClick={() => setShow(show === "password" ? "text" : "password")}
                    >
                        {show === "password" ? <VisibilityOff /> : <Visibility />}
                    </div>
                </div>

                <div className='flex justify-between space-x-2 pr-2 border items-center rounded-md'>
                    <input
                        type={show}
                        name="cpassword"
                        className='outline-none p-1 pl-2 w-full rounded-md rounded-r-none'
                        value={form.cpassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        autoComplete="true"
                    />

                    <div className={`cursor-pointer ${darkMode ? 'text-white' : 'text-gray-400'}`}
                        onClick={() => setShow(show === "password" ? "text" : "password")}
                    >
                        {show === "password" ? <VisibilityOff /> : <Visibility />}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-1 gap-3">
                    <Link className={`${darkMode ? 'text-white' : 'text-gray-400'} hover:underline pl-2'`} to="/Login">Already have an account?</Link>
                    <button
                        type="submit"
                        className="p-1 rounded-md transition-all w-fit bg-indigo-600 text-white active:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <p className="flex items-center">
                                <svg aria-hidden="true" className="w-5 h-5 animate-spin dark:text-indigo-500 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className='pr-2 pl-2'>Submit</span>
                            </p>
                        ) : (
                            <span className='pr-2 pl-2'>Submit</span>
                        )}
                    </button>
                </div>

            </form>
            <ToastContainer autoClose={3000} />
        </div>
    );
}

export default SignUp;
