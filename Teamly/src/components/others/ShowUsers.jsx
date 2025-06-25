import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { LuUsers } from "react-icons/lu";
import Modal from "../others/Modal.jsx";
import AvatarGroup from "../others/AvatarGroup.jsx";
import selectUsers from "../inputs/SelectUsers.jsx";

const ShowUsers = ({ selectedUsers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const selectedUserAvatars = selectedUsers.map((user) => user.profileImageUrl);

    return (
        <>
            <div className="space-y-4 mt-2">
                { selectedUserAvatars.length > 0 && (
                    <div
                        className="cursor-pointer"
                        onClick={ () => setIsModalOpen(true) }
                    >
                        <AvatarGroup avatars={ selectedUserAvatars } maxVisible={ 5 }/>
                    </div>
                ) }

                <Modal
                    isOpen={ isModalOpen }
                    onClose={ () => {
                        setIsModalOpen(false);
                    } }
                    title={ "Assigned Users" }
                >
                    <div className="space-y-4 h-[60vh] oveflow-y-auto">
                        { selectedUsers.map((user) => (
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
                            </div>
                        )) }
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default ShowUsers;