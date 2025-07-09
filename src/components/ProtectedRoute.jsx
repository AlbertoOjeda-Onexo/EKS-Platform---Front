import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useUserStore } from "../store/userStore";
import axios from "axios";

function ProtectedRoute({ children, requiredPermission = null }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const permissions = useUserStore((state) => state.permissions);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) return setIsAuthorized(false);

        const now = Date.now() / 1000;
        const decodedRefresh = jwtDecode(refreshToken);
        if (decodedRefresh.exp < now) return setIsAuthorized(false);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}user/auth/refresh-token/`, {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log("Error al refrescar el token: ", error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return setIsAuthorized(false);

        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Cargando...</div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }
    
    if (requiredPermission && !permissions.includes(requiredPermission)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default ProtectedRoute;
