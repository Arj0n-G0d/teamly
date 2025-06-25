import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { LuUsers } from "react-icons/lu";
import Modal from "../others/Modal.jsx";
import AvatarGroup from "../others/AvatarGroup.jsx";

const SelectUsers = ({ selectedUsers, setSelectedUser }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState(selectedUsers);
    const [loading, setLoading] = useState(true);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if(response.data.allUsersWithTaskCount?.length > 0) setAllUsers(response.data.allUsersWithTaskCount);
        } catch(error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserSelect = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId) ?
                prev.filter((id) => id !== userId) :
                [...prev, userId]
        );
    };

    const handleAssign = () => {
        setSelectedUser(tempSelectedUsers);
        setIsModalOpen(false);
    };

    const selectedUserAvatars = allUsers?.filter((user) => selectedUsers.includes(user._id))
        .map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <>
            { !loading &&
                <div className="space-y-4 mt-2">
                    { selectedUserAvatars.length === 0 && (
                        <button className="card-btn" onClick={() => {
                            setTempSelectedUsers(selectedUsers);
                            setIsModalOpen(true); }
                        }>
                            <LuUsers className="text-sm" /> Add Members
                        </button>
                    )}

                    { selectedUserAvatars.length > 0 && (
                        <div
                            className="cursor-pointer"
                            onClick={ () => setIsModalOpen(true) }
                        >
                            <AvatarGroup avatars={ selectedUserAvatars } maxVisible={ 3 }/>
                        </div>
                    ) }

                    <Modal
                        isOpen={ isModalOpen }
                        onClose={ () => {
                            setTempSelectedUsers(selectedUsers);
                            setIsModalOpen(false);
                        } }
                        isLoading={ loading }
                        title={ "Select Users" }
                    >
                        <div className="space-y-4 h-[60vh] oveflow-y-auto">
                            { allUsers.map((user) => (
                                <div
                                    className="flex items-center gap-4 p-3 border-b border-gray-200"
                                    key={ user._id }

                                >
                                    {user?.profileImageUrl ? (
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={user.profileImageUrl}
                                            alt="Profile"
                                        />
                                    ) : (
                                        <span className="w-10 h-10 rounded-full text-sm text-gray-500"></span>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">
                                            { user.name }
                                        </p>
                                        <p className="text-[15px] text-gray-500">
                                            { user.email }
                                        </p>

                                    </div>

                                    <input
                                        type={ "checkbox" }
                                        checked={ tempSelectedUsers.includes(user._id) }
                                        onChange={ () => toggleUserSelect(user._id) }
                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                                    />
                                </div>
                            )) }
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                className="card-btn-fill"
                                onClick={ handleAssign }
                            >
                                Done
                            </button>
                        </div>
                    </Modal>
                </div>
            }
        </>
    );
};

export default SelectUsers;