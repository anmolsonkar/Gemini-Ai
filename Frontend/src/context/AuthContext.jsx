import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

const authReducer = (state, action) => {
    switch (action.type) {
        case "SET_AUTH":
            return {
                ...state,
                authUser: action.payload
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [cookies, , removeCookie] = useCookies(["jwt"]);

    const [state, dispatch] = useReducer(authReducer, {
        authUser: null
    });

    const { authUser } = state;

    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                if (cookies.jwt) {
                    const { data } = await axios.post(
                        "http://localhost:4000",
                        {},
                        { withCredentials: true }
                    );
                    if (data.status) {
                        dispatch({
                            type: "SET_AUTH",
                            payload: cookies.jwt
                        });
                    } else {
                        removeCookie("jwt");
                    }
                } else {
                    dispatch({
                        type: "SET_AUTH",
                        payload: null
                    });
                }
            } catch (error) {
                console.error("Error verifying user:", error);
                removeCookie("jwt");
            }
        };

        verifyUser();
    }, [cookies.jwt, removeCookie, navigate]);

    return (
        <AuthContext.Provider value={{ authUser }}>
            {children}
        </AuthContext.Provider>
    );
};
