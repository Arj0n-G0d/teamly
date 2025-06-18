import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { useState } from "react";
import { validateEmail } from "../../utils/helper.js";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector.jsx";
import Input from "../../components/inputs/Input.jsx";
import { Link } from "react-router-dom";

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, setAdminInvite] = useState("");

    const [error, setError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();

        if(!fullName) return setError("Please enter full name");
        if(!validateEmail(email)) return setError("Please enter a valid email address");
        if(!password) return setError("Please enter the password");

        setError("");

        // Sign-Up API Call
    };

    return <AuthLayout>
        <div className="lg:w-[70%] h-auto md:mb-5 md:h-full mt-5 md:mt-0 flex flex-col justify-center ">
            <h3 className="text-xl font-semibold text-black">Create an Account</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
                Join us today by entering your details below
            </p>

            <form onSubmit={ handleSignUp } className="mb-10">
                <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        value={ fullName }
                        onChange={({ target }) => setFullName(target.value)}
                        label={ "Full Name" }
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
                        placeholder={ "8 Digit Code" }
                        type={ "text" }
                        label={ "Admin Invite Token" }
                    />
                </div>
                { error && <p className={ "text-red-500 text-xs pb-2.5" }>{ error }</p> }
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