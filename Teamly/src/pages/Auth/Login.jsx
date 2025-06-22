import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input.jsx";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/UserContext.jsx";
import Spinner from "../../components/others/Spinner.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [placeholderCredentials, setPlaceholderCredentials] = useState({});

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const { updateUser } = useContext(UserContext);

    const getFakeCredentials = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.AUTH.GEN_FAKE_CREDENTIALS);
            setPlaceholderCredentials(response.data);
        } catch(error) {
            setError("Something went wrong");
        }  finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFakeCredentials();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)) return setError("Please enter a valid email address");
        if(!password) return setError("Please enter the password");

        setError("");

        // Login API Call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password
            });

            const { token, role } = response.data;

            if(token) {
                localStorage.setItem("token", token);
                updateUser(response.data);

                // Redirect based on Role
                if (role === "Admin") navigate("/admin/dashboard");
                else navigate("/user/dashboard");
            }
        } catch(error) {
            if(error.response && error.response.data.message) setError(error.response.data.message);
            else setError("Something went wrong");
        }
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <AuthLayout>
                    <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                        <p className="text-xs text-slate-700 mt-[5px] mb-6">
                            Please enter your details to log in
                        </p>
                        <form onSubmit={handleLogin} className="mb-10">
                            <Input
                                value={email}
                                onChange={({ target }) => setEmail(target.value)}
                                placeholder={placeholderCredentials?.email}
                                type={"text"}
                                label={"Email Address"}
                            />
                            <Input
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                placeholder={placeholderCredentials?.password}
                                type={"password"}
                                label={"Password"}
                            />

                            {error && (
                                <p className="text-red-500 text-xs pb-2.5">{error}</p>
                            )}
                            <button type="submit" className="btn-primary">
                                Login
                            </button>
                            <p className="text-xs text-slate-800 mt-3">
                                Don't have an account?{" "}
                                <Link className="font-medium text-primary" to="/sign-up">
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </AuthLayout>
            )}
        </>
    );
};

export default Login;