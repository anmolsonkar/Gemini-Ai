import { useState, useRef, useEffect } from "react";
import { Close, Menu } from "@mui/icons-material";

const Header = () => {
    const [menu, setMenu] = useState(false);
    const menuRef = useRef(null);

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
            <nav className="flex justify-between w-full p-4 align-middle items-center fixed z-10 bg-[#F1F3F4]">
                <div className="flex items-center cursor-pointer">
                    <img className="w-8 mr-1" src="https://i.imgur.com/HLysXTu.gif" alt="Gemini Logo" />
                    <span className="text-lg">Gemini Ai</span>
                </div>
                <div>
                    <div className="hidden lg:flex md:flex space-x-7 mr-4">
                        <img className="w-9 cursor-pointer" src="https://i.imgur.com/izjKYfy.png" alt="Profile" />

                    </div>
                    <span className=" lg:hidden md:hidden" onClick={() => setMenu(true)}>
                        {menu ? <Close sx={{ fontSize: 27 }} /> : <Menu sx={{ fontSize: 27 }} />}
                    </span>
                </div>
            </nav>

            <div
                ref={menuRef}
                className={`fixed z-10 left-0 top-0 w-[85vw] flex flex-col justify-between  h-full bg-white duration-200 transform shadow ${menu ? "translate-x-0" : "-translate-x-full "
                    }`}
            >
                <div className="flex flex-col mt-3 border">
                    <div>
                        <p className="p-2">Chats</p>
                        <div className="flex flex-col  p-2">
                            First
                        </div>
                    </div>

                </div>

                <div className="flex space-x-2 p-3 border items-center">
                    <img className="w-9 cursor-pointer" src="https://i.imgur.com/izjKYfy.png" alt="Profile" />
                    <span>anmolsonkar742@gmail.com</span>
                </div>

            </div>
        </>
    );
};

export default Header;