import Form from "../../components/system/Form"
import "../../styles/system/LoginPage.css"

function Login() {
    return (
        <div className="login-container">
            <Form route="/user/auth/login/" method="login" />
        </div>
    )
}

export default Login