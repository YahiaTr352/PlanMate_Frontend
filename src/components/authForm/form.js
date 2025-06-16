import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { authUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { validateAuthForm } from "../../utils/vaildation";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./form.css";
import { toast } from "react-toastify";

export const FormAuth = ({ title, endPoint, fields, buttonName }) => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { loading, backendAuthErrors } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordC, setShowPasswordC] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        passwordC: ""
    });
    const [errors, setErrors] = useState({});

        useEffect(() => {
        document.body.classList.add("auth-page");

        return () => {
            document.body.classList.remove("auth-page");
        };
        }, []);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
        setErrors({...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateAuthForm(form , endPoint);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const result = await dispatch(authUser({ form, endPoint })).unwrap();
            nav("/home");
            const message = `Hi ${result.user.name}`;
            toast.success(message);
        } catch (error) {
            console.error("Error during authentication", error);
        }
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const handleChangePasswordC = (e) => {
        e.preventDefault();
        setShowPasswordC(!showPasswordC);
    };

    return (
        <div className="auth-card">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">{title}</h2>
                <div className="auth-div-form">
                    {fields.includes("userName") && (
                        <>
                            <label className="auth-label" htmlFor="userName">User Name:</label>
                            <input 
                                className={`auth-input ${errors?.name || backendAuthErrors?.name ? "error" : ""}`}
                                id="userName"
                                name="name"
                                placeholder="Enter your name ..."
                                onChange={handleChange}
                            />
                            {backendAuthErrors?.name && <p className="auth-error">{backendAuthErrors?.name}</p>}
                        </>
                    )}

                    {fields.includes("email") && (
                        <>
                            <label className="auth-label" htmlFor="email">Email:</label>
                            <input 
                                className={`auth-input ${(errors?.email || errors?.emailFormat || backendAuthErrors?.email || backendAuthErrors?.invalidAuth)  ? "error" : ""}`}
                                id="email"
                                name="email"
                                placeholder="Enter your email ..."
                                onChange={handleChange}
                            />
                            {errors?.emailFormat && <p className="auth-error">{errors?.emailFormat}</p>}
                            {backendAuthErrors?.email && <p className="auth-error">{backendAuthErrors?.email}</p>}
                        </>
                    )}

                    {fields.includes("password") && (
                        <>
                            <label className="auth-label" htmlFor="password">Password:</label>
                            <div className="auth-div-password">
                                <input 
                                    className={`auth-input ${(errors?.password || errors?.passwordCMatch || backendAuthErrors?.invalidAuth)  ? "error" : ""}`}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password ..."
                                    onChange={handleChange}
                                />
                                <button 
                                    type="button"
                                    className="auth-showButton" 
                                    onClick={handleChangePassword}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {backendAuthErrors?.invalidAuth && <p className="auth-error">{backendAuthErrors?.invalidAuth}</p>}


                        </>
                    )}

                    {fields.includes("passwordC") && (
                        <>
                            <label className="auth-label" htmlFor="passwordC">Confirm Password:</label>
                            <div className="auth-div-password">
                                <input 
                                    className={`auth-input ${(errors?.passwordC || errors?.passwordCMatch) ? "error" : ""}`}
                                    id="passwordC"
                                    name="passwordC"
                                    type={showPasswordC ? "text" : "password"}
                                    placeholder="Confirm your password ..."
                                    onChange={handleChange}
                                />
                                <button 
                                    type="button"
                                    className="auth-showButton" 
                                    onClick={handleChangePasswordC}>
                                    <FontAwesomeIcon icon={showPasswordC ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {errors?.passwordCMatch && <p className="auth-error">{errors?.passwordCMatch}</p>}
                        </>
                    )}
                </div>

                <div className="auth-div-button">
                    <button className="auth-button" type="submit" disabled={loading} >
                        {loading ? <div className="loading-spinner"></div> : buttonName}
                    </button>
                </div>
                <div className="auth-toggle">
                    {endPoint === "login" ? (
                         <p className="auth-paragraph-bottom">
                         Don't have an account? <Link to="/signup" className="auth">Create account</Link>
                         </p>
                ) : (
                <p className="auth-paragraph-bottom">
                 Already have an account? <Link to="/login" className="auth">Login now</Link>
                </p>
               )}
             </div>
            </form>
        </div>
    );
};
