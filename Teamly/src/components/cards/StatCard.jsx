import { getStatusBadgeColor } from "../../utils/helper.js";

const StatCard = ({ label, count, status }) => {
    return (
        <div className={`flex-1 items-center max-w-[150px] flex flex-col text-[10px] font-medium ${getStatusBadgeColor(status)} px-2 py-1 rounded-md`}>
            <span className="text-[12px] font-semibold">{count}</span>
            {label}
        </div>
    );
};

export default StatCard;
