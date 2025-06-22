import Progress from "../others/Progress.jsx";
import AvatarGroup from "../others/AvatarGroup.jsx";
import {getPriorityTagColor, getStatusBorderColor, getStatusTagColor} from "../../utils/helper.js";
import moment from "moment";
import {LuPaperclip} from "react-icons/lu";

const TaskCard = ({ title, description, priority, status, progress, createdAt, dueDate, assignedTo, attachmentCount, completedTodoCount, todoChecklist, onClick }) => {
    return (
        <div
            className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50"
        >
            <div className="flex items-end gap-3 px-4">
                <div
                    className={ `text-[11px] font-medium ${getStatusTagColor(status)} px-4 py-0.5 rounded` }
                >
                    { status }
                </div>
                <div
                    className={ `text-[11px] font-medium ${getPriorityTagColor(priority)} px-4 py-0.5 rounded` }
                >
                    { priority } Priority
                </div>
            </div>
            <div className={ `px-4 border-l-[3px] ${getStatusBorderColor(status)}` }>
                <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
                    { title }
                </p>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leadin-[18px]">
                    { description || " " }
                </p>
                <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
                    Task Done: { " " }
                    <span  className="font-semibold text-gray-700">
                        { completedTodoCount } / { todoChecklist.length || 0 }
                    </span>
                </p>

                <Progress progress={ progress } status={ status }/>
            </div>
            <div className="px-4">
                <div className="flex items-center justify-between my-1">
                    <div>
                        <label className="text-xs text-gray-500">Start Date</label>
                        <p className="text-[13px] font-medium text-gray-900">
                            { moment(createdAt).format("Do MMM YYYY") }
                        </p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Due Date</label>
                        <p className="text-[13px] font-medium text-gray-900">
                            { moment(dueDate).format("Do MMM YYYY") }
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                        <AvatarGroup avatars={ assignedTo || [] } />

                        { attachmentCount > 0 && (
                            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                                <LuPaperclip className="text-primary" />{ " " }
                                <span className="text-xs text-gray-900">{ attachmentCount }</span>
                            </div>
                        ) }
                    </div>
                    <button className="card-btn" onClick={ onClick }>Update</button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;