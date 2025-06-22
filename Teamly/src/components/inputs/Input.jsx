import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, type, label, link = null, className }) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return <div>
        { link ? <label className="text-[13px] text-slate-800">{ label } { " " } { link }</label> :
            <label className="text-[13px] text-slate-800">{ label }</label> }
        <div className={`input-box ${className}`}>
            <input
                type={ type === "password" ? showPassword ? "text" : "password" : type }
                placeholder={ placeholder }
                className="w-full bg-transparent outline-none"
                value={ value }
                onChange={(e) => onChange(e)}
            />
            { type === "password" && (
                <>
                    {showPassword ? (
                        <FaRegEye
                            size={25}
                            className="text-primary cursor-pointer"
                            onClick={ toggleShowPassword }
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={25}
                            className="text-slate-400 cursor-pointer"
                            onClick={ toggleShowPassword }
                        />
                    )}
                </>
            ) }
        </div>
    </div>
};

export default Input;