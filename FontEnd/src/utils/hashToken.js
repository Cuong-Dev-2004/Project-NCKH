import { jwtDecode } from "jwt-decode";

import { getToken } from "./auth";


export const getUserRole = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role
    } catch (error) {
        console.error("Token không hợp lệ:", error);
        return null;
    }
};

export const getUserid = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.userId
    } catch (error) {
        console.error("Token không hợp lệ:", error);
        return null;
    }
};

