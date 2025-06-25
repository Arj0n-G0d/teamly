import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import Spinner from "../../components/others/Spinner.jsx";
import {LuFileSpreadsheet} from "react-icons/lu";
import UserCard from "../../components/cards/UserCard.jsx";
import toast from "react-hot-toast";
import { HiMiniPlus } from "react-icons/hi2";
import Modal from "../../components/others/Modal.jsx";
import Input from "../../components/inputs/Input.jsx";
import {validateEmail} from "../../utils/helper.js";
import DeleteAlert from "../../components/others/DeleteAlert.jsx";

const TeamMembers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [placeholderCredentials, setPlaceholderCredentials] = useState({});

    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const getFakeCredentials = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.AUTH.GEN_FAKE_CREDENTIALS);
            setPlaceholderCredentials(response.data);
        } catch(error) {
            console.error("Error fetching fake credentials", error);
        }  finally {
            setLoading(false);
        }
    };

    const getAllUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            setAllUsers(response.data.allUsersWithTaskCount);
        } catch(error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMemberAdd = async () => {
        if(email === "" || !validateEmail(email)) return setError("Please enter a valid email address");
        setError("");

        try {
            setButtonLoading(true);
            const response = await axiosInstance.post(API_PATHS.USERS.ADD_MEMBER, {
                email
            });
            await getAllUsers();
            setIsModalOpen(false);
            toast.success("Team member added");
            setEmail("");
        } catch(error) {
            console.error("Error adding team member", error);
            setError("Please enter a registered email address");
        } finally {
            setButtonLoading(false);
        }
    };

    const handleMemberRemove = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.USERS.REMOVE_MEMBER, {
               email
            });
            await getAllUsers();
            toast.success("Team member removed");
            setOpenDeleteAlert(false);
            setEmail("");
        } catch(error) {
            console.error("Error removing team member");
            toast.error("Error removing team member", error);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
                responseType: "blob"
            });

            // Create the URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "user_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("User Report Downloaded");
        } catch(error) {
            console.error("Error downloading user report", error);
            toast.error("Failed to Download User Report");
        }
    };

    useEffect(() => {
        getAllUsers();
        getFakeCredentials();
    }, []);

    return (
        <>
            { loading ? (
                <Spinner />
            ) : (
                <DashboardLayout activeMenu={ "Team Members" }>
                    <div className="my-5">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                            <div className="flex md:flex md:items-center items-center justify-between gap-3">
                                <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

                                <div className="flex flex-row gap-3">
                                    <button type="submit" className="flex lg:hidden w-[100px] text-sm font-medium shadow-lg shadow-purple-600/5 p-[10px] rounded bg-blue-100 text-blue-900 border border-blue-200 hover:border-blue-400 cursor-pointer items-center justify-center gap-1">
                                        <HiMiniPlus className="text-lg" />
                                        Add
                                    </button>
                                    <button
                                        className="download-btn flex lg:hidden"
                                        onClick={ handleDownloadReport }
                                    >
                                        <LuFileSpreadsheet className="text-lg" />
                                        Download Report
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button type="button" onClick={ () => setIsModalOpen(true) } className="hidden lg:flex w-[100px] text-sm font-medium shadow-lg shadow-purple-600/5 p-[10px] rounded bg-blue-100 text-blue-900 border border-blue-200 hover:border-blue-400 cursor-pointer items-center justify-center gap-1">
                                    <HiMiniPlus className="text-lg" />
                                    Add
                                </button>
                                <button className="download-btn hidden lg:flex" onClick={ handleDownloadReport }>
                                    <LuFileSpreadsheet className="text-lg" />
                                    Download Report
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 mb-4">
                        { allUsers.map((user, index) => (
                            <UserCard key={ index } userInfo={ user } onRemove={ () => {
                                setEmail(user.email);
                                setOpenDeleteAlert(true)
                            } }/>
                        )) }
                    </div>

                    <Modal
                        title={ "Add Member" }
                        isOpen={ isModalOpen }
                        onClose={ () => setIsModalOpen(false) }
                    >
                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            placeholder={ placeholderCredentials?.email }
                            type={"text"}
                            label={"Email Address"}
                        />
                        {error && (
                            <p className="text-red-500 text-xs pb-2.5">{error}</p>
                        )}
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                className="card-btn-fill"
                                onClick={ handleMemberAdd }
                                disabled={ buttonLoading }
                            >
                                Add
                            </button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={ openDeleteAlert }
                        onClose={ () => setOpenDeleteAlert(false) }
                        title={ "Remove Member" }
                    >
                        <DeleteAlert
                            content={ "Are you sure you want to remove this member?" }
                            onDelete={ handleMemberRemove }
                            onCancel={ () => setOpenDeleteAlert(false) }
                            buttonContent={ "Remove" }
                        />
                    </Modal>
                </DashboardLayout>
            ) }
        </>
    );
};

export default TeamMembers;