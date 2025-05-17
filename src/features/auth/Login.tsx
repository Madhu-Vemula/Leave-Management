import { ChangeEvent, useState } from "react";
import palTechLogo from "../../assets/images/paltech_logo.png"
import palTechCover from "../../assets/images/paltech_cover.jpeg"
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface LoginForm {
    email: string,
    password: string
}
const Login: React.FC = () => {
    const [loginForm, setLoginForm] = useState<LoginForm>({
        email: "",
        password: ""
    })
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("")
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const handleOnSubmit = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!loginForm.email || !loginForm.password) {
            setHasError(true);
            return;
        }
        const user = { email: loginForm.email, password: loginForm.password };
        if (loginForm.email === 'hr@pal.tech' && loginForm.password=== "hr@pal") {
            const validUser = JSON.stringify({ email: loginForm.email, role: "hr" })
            sessionStorage.setItem('user', validUser);
            navigate("/hr");
        }

        try {
            const response = await loginUser(user).unwrap();
            const responseUser = response[0];
            console.log(responseUser)
            if (responseUser) {
                if (responseUser.password !== loginForm.password) {
                    setErrorMessage("Your password is incorrect!")
                    return
                }
                const validUser = JSON.stringify({ email: loginForm.email, role: responseUser.role });
                sessionStorage.setItem('user', validUser)
                navigate(`/${responseUser.role}`)
            }
            else {
                setErrorMessage("User mail not exist!");
                return;
            }
        }
        catch (error) {
            alert(`Error Message ${error}`)
        }
    }

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const emailValue = event.target.value;
        setLoginForm({ ...loginForm, email: emailValue });
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const passwordValue = event.target.value;
        setLoginForm({ ...loginForm, password: passwordValue });
    }
    return (
        <div className="login-container">
            <img src={palTechCover} alt="paltech-cover" className="paltech-cover" />
            <div className="form-wrapper">
                <form onSubmit={handleOnSubmit} className="form-container">
                    <div className="form-header">
                        <img src={palTechLogo} alt="paltech-logo" className="paltech-logo" />
                        <h1>Login</h1>
                    </div>
                    <label htmlFor="email">Email<span className="error-message">*</span></label>
                    <input type="text" id="email"
                        name="email" value={loginForm.email}
                        onChange={(e) => handleEmailChange(e)}
                        placeholder="Enter your mail" />
                    {hasError && !loginForm.email && (<span className="error-message">Field is required</span>)}
                    <label htmlFor="email">Password<span className="error-message">*</span></label>
                    <input type="password" id="password"
                        name="password" value={loginForm.password}
                        onChange={(e) => handlePasswordChange(e)}
                        placeholder="Enter your password" />
                    {hasError && !loginForm.password && (<span className="error-message">Field is required</span>)}
                    <button type="submit" className="button submit-btn">Submit</button>
                    {errorMessage && (<span className="error-message">{errorMessage}</span>)}
                </form>
            </div>
        </div>
    )
}

export default Login