import { getStatusTagColor } from "../../utils/helper.js";

const Progress = ({ progress, status }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-1.5 ">
            <div
                className={ `${getStatusTagColor(status)} h-1.5 rounded-full text-center text-xs font-medium` }
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default Progress;