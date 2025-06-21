import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { useState, useContext } from "react";
import { validateEmail } from "../../utils/helper.js";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector.jsx";
import Input from "../../components/inputs/Input.jsx";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/UserContext.jsx";
import uploadImage from "../../utils/uploadImage.js";

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, setAdminInvite] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const { updateUser } = useContext(UserContext);

    const handleAdminInviteCodeRequest = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if(!email || !validateEmail(email)) return setError("Please enter a valid email address");
        try {
            await axiosInstance.post(API_PATHS.AUTH.GEN_ADMIN_INVITE_TOKEN, { email });
            setSuccess("Admin Invite Token successfully sent");
        } catch(error) {
            if(error.response && error.response.data.message) setError(error.response.data.message);
            else setError("Something went wrong");
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if(!name) return setError("Please enter full name");
        if(!validateEmail(email)) return setError("Please enter a valid email address");
        if(!password) return setError("Please enter the password");

        // Sign-Up API Call
        try {
            // Upload image if present
            const profileImageUrl = await uploadImage(profilePic) || "";

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name,
                email,
                password,
                profileImageUrl,
                adminInviteToken
            });

            const { token, role } = response.data;

            if(token) {
                localStorage.setItem("token", token);
                updateUser(response.data);

                // Redirect based on Role
                if(role === "Admin") navigate("/admin/dashboard");
                else navigate("/user/dashboard");
            }
        } catch(error) {
            if(error.response && error.response.data.message) setError(error.response.data.message);
            else setError("Something went wrong");
        }
    };

    return <AuthLayout>
        <div className="lg:w-[70%] h-auto md:mb-5 md:h-full mt-5 md:mt-0 flex flex-col justify-center ">
            <h3 className="text-xl font-semibold text-black">Create an Account</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
                Join us today by entering your details below
            </p>

            <form onSubmit={ handleSignUp } className="mb-10">
                <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <Input
                        value={ name }
                        onChange={({ target }) => setName(target.value)}
                        label={ "Name" }
                        placeholder={ "John" }
                        type={ "text" }
                    />
                    <Input
                        value={ email }
                        onChange={ ({ target }) => setEmail(target.value) }
                        placeholder={ "john@example.com" }
                        type={ "text" }
                        label={ "Email Address" }
                    />
                    <Input
                        value={ password }
                        onChange={ ({ target }) => setPassword(target.value) }
                        placeholder={ "john123" }
                        type={ "password" }
                        label={ "Password" }
                    />
                    <Input
                        value={ adminInviteToken }
                        onChange={ ({ target }) => setAdminInvite(target.value) }
                        placeholder={ "Admin Invite Code" }
                        type={ "text" }
                        label={ "Leading a Team ? " }
                        link={ <Link className="font-medium text-primary" to={ "" } onClick={ handleAdminInviteCodeRequest }>Get Admin Invite Code</Link> }
                    />
                </div>
                { error && <p className={ "text-red-500 text-xs pb-2.5" }>{ error }</p> }
                { success && <p className={ "text-green-500 text-xs pb-2.5" }>{ success }</p> }
                <button type={ "submit" } className={ "btn-primary" }>Sign Up</button>
                <p className="text-xs text-slate-800 mt-3">
                    Already have an account? {" "}
                    <Link className="font-medium text-primary" to={ "/login" }>Login</Link>
                </p>
            </form>
        </div>
    </AuthLayout>
};

export default SignUp;