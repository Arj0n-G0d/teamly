import { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import Navbar from "../others/Navbar.jsx";
import SideMenu from "../others/SideMenu.jsx";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user, loading } = useContext(UserContext);
    return (
        <div className="">
            <Navbar activeMenu={ activeMenu } />

            {user && (
                <div className="flex">
                    <div className="max-[1000px]:hidden">
                        <SideMenu activeMenu={ activeMenu } />
                    </div>

                    <div className="grow mx-5">{ children }</div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;