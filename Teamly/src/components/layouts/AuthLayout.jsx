import UI_IMG from "../../assets/images/auth-image.png";
import BG_IMG from "../../assets/bg-img.jpg"
import Logo from "../others/Logo.jsx";

const AuthLayout = ({ children }) => {
    return <div className="flex">
        <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-14">
            {/*<h2 className="text-lg font-medium text-black">Teamly</h2>*/}
            <Logo/>
            { children }
        </div>

        <div
            className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8"
            style={{ backgroundImage: `url(${BG_IMG})` }}
        >
            <img alt="" src={UI_IMG} className="w-64 lg:w-[90%]" />
        </div>
    </div>
};

export default  AuthLayout;