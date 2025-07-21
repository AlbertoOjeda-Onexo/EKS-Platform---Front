import api from "../../api";
import Swal from 'sweetalert2'
import "../../styles/system/Form.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import LoadingIndicator from "./LoadingIndicator";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function Form({ route, method }) {    
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Registro";

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;
            if (decoded.exp > now) {
                navigate("/");
            }
            } catch (error) {
            console.log("Token inválido en Login, ignorando redirección");
            }
        }
    }, []);


    const handleSubmit = async (e) => {
        setLoading(true);
        localStorage.clear();
        e.preventDefault();

        try {
            const res = await api.post(route, { userName, email, password });            
            if (method === "login" && res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access_token);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh_token);

                useUserStore.getState().setUser({
                    user: res.data.user,
                    permissions: res.data.permissions
                });
                
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {            
            Swal.fire({
                title: error.response.data.code,
                text: error.response.data.detail,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#2859d3',
                showClass: {
                    popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                    `
                },
                hideClass: {
                    popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                    `
                }
            })            
        } finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            {name == 'Registro' && (
                <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@test.com"
                />    
            )
            }        
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button-register" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form