import StatCard from "./StatCard.jsx";
import { HiXMark } from "react-icons/hi2";

const UserCard = ({ userInfo, onRemove }) => {
    return (
        <div className="user-card p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={userInfo?.profileImageUrl}
                        alt=""
                        className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <div>
                        <p className="text-sm font-medium">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500">{userInfo?.email}</p>
                    </div>
                </div>

                <button
                    className="flex items-center gap-1.5 text-[15px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                    onClick={ onRemove }
                >
                    <HiXMark className="text-base" /> Remove
                </button>
            </div>

            <div className="flex justify-between items-end gap-3 mt-5">
                <StatCard
                    label={"Pending"}
                    count={userInfo?.pendingTasks || 0}
                    status={"Pending"}
                />
                <StatCard
                    label={"In Progress"}
                    count={userInfo?.inProgressTasks || 0}
                    status={"In Progress"}
                />
                <StatCard
                    label={"Completed"}
                    count={userInfo?.completedTasks || 0}
                    status={"Completed"}
                />
            </div>
        </div>
    );
};

export default UserCard;
