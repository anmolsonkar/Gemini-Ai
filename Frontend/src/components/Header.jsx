import { useState, useRef, useEffect } from "react";
import { Clear, Close, DarkMode, LightMode, Menu } from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

const Header = ({ memoizedConversation, handleDelete, handleview }) => {
    const [menu, setMenu] = useState(false);
    const menuRef = useRef(null);

    const [hover, sethover] = useState(null)
    const { darkMode, toggleTheme } = useTheme();


    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenu(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menu]);


    return (
        <>
            <nav className={`flex justify-between w-full p-4 align-middle items-center fixed z-10 ${darkMode ? 'bg-[#121212] text-white' : 'bg-[#f1f3f4]'}`}>
                <div className="flex items-center cursor-pointer">
                    <img className="w-8 mr-1" src="https://i.imgur.com/HLysXTu.gif" alt="Gemini Logo" />
                    <span className="text-lg">Gemini Ai</span>
                </div>
                <div>
                    <span className="cursor-pointer mr-5 md:hidden lg:hidden" onClick={toggleTheme}>
                        {darkMode ? <DarkMode sx={{ fontSize: 27 }} /> : <LightMode sx={{ fontSize: 27 }} />}
                    </span>

                    <div className="hidden lg:flex md:flex space-x-7 mr-4 items-center">
                        <span className="cursor-pointer" onClick={toggleTheme}>
                            {darkMode ? <DarkMode sx={{ fontSize: 27 }} /> : <LightMode sx={{ fontSize: 27 }} />}
                        </span>
                        <img className="w-9 cursor-pointer" src="https://i.imgur.com/izjKYfy.png" alt="Profile" />

                    </div>
                    <span className=" lg:hidden md:hidden" onClick={() => setMenu(true)}>
                        {menu ? <Close sx={{ fontSize: 27 }} /> : <Menu sx={{ fontSize: 27 }} />}
                    </span>
                </div>
            </nav>

            <div
                ref={menuRef}
                className={`fixed z-10 left-0 top-0 w-[85vw] flex flex-col justify-between  h-full ${darkMode ? 'bg-[#121212] text-white' : 'bg-white'} duration-200 transform shadow ${menu ? "translate-x-0" : "-translate-x-full "
                    }`}
            >
                <div className="flex flex-col mt-3">
                    <div className={`${darkMode ? 'bg-[#121212] aside-dark' : 'bg-white aside-light'} min-w-[19vw] overflow-hidden overflow-y-auto h-[89.3vh]  lg:min-w-[25vw] xl:min-w-[18vw] rounded-xl`}>
                        {memoizedConversation && memoizedConversation.map(message => (

                            message.user === 'User' &&
                            <div key={message._id} onClick={() => handleview(message._id)} className={`${darkMode ? 'bg-[#1e1e1e] text-white' : 'bg-[#f1f3f4]'} active:scale-[97%] duration-100  p-2 flex justify-between items-center m-3 cursor-pointer rounded-md lg:max-w-[20rem]`} onMouseEnter={() => sethover(message._id)}
                                onMouseLeave={() => sethover(null)}>
                                <button className='flex' style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    <img className='w-7 h-7' src="https://i.imgur.com/HLysXTu.gif" alt="Logo" />
                                    <span className='ml-2'>{message.message}</span>
                                </button>
                                {hover === message._id && <Clear onClick={() => handleDelete(message._id)} className='text-gray-300' />}
                            </div>
                        ))
                        }

                    </div>

                </div>

                <div className={`flex space-x-2 rounded-md m-3 p-3 items-center ${darkMode ? 'bg-[#1e1e1e] text-white' : 'bg-[#f1f3f4]'}`}>
                    <img className="w-9 cursor-pointer" src="https://i.imgur.com/izjKYfy.png" alt="Profile" />
                    <span>anmolsonkar742@gmail.com</span>
                </div>

            </div>
        </>
    );
};

export default Header;