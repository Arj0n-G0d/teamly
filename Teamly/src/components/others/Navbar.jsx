import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import { useState } from "react";
import Logo from "./Logo.jsx";
import SideMenu from "./SideMenu.jsx";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[12px] py-4 px-7 sticky top-0 z-30">
            <button
                className="black lg:hidden text-black"
                onClick={ () => { setOpenSideMenu(!openSideMenu) } }
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>
            <Logo />
            {openSideMenu && (
                <div className="fixed top-[75px] -ml-4 bg-white">
                    <SideMenu activeMenu={ activeMenu } />
                </div>
            )}
        </div>
    );
};

export default Navbar;