import { useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(loading) return;
        if(user) return;

        if(!user) {
            clearUser();
            navigate("/login");
        }
    }, [user, loading]);
};

export default useUserAuth;