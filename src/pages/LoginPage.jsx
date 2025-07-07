import Form from "../components/Form"
import "../styles/LoginPage.css"

function Login() {
    return (
        <div className="login-container">
            <Form route="/user/auth/login/" method="login" />
        </div>
    )
}

export default Login