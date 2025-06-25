import moment from "moment";
import { getPriorityBadgeColor, getStatusBadgeColor } from "../../utils/helper.js";

const TaskListTable = ({ tableData }) => {
    return (
        <div className="overflow-x-auto p-0 rounded-lg mt-3">
            <table className="min-w-full">
                <thead>
                    <tr className="text-left">
                        <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">Name</th>
                        <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">Status</th>
                        <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">Priority</th>
                        <th className="py-3 px-4 text-gray-800 font-medium text-[15px] hidden md:table-cell">Created On</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((task) => (
                        <tr key={task._id} className="border-t border-gray-200">
                            <td className="my-3 mx-4 text-gray-700 text-[15px] line-clamp-1 overflow-hidden">{task.title}</td>
                            <td className="py-4 px-4">
                                <span className={ `px-2 py-1 text-xs inline-block ${getStatusBadgeColor(task.status)}` }>{task.status}</span>
                            </td>
                            <td className="py-4 px-4">
                                <span className={ `px-2 py-1 text-xs inline-block ${getPriorityBadgeColor(task.priority)}` }>{task.priority}</span>
                            </td>
                            <td className="py-4 px-4 text-gray-700 text-[15px] text-nowrap hidden md:table-cell">{task.createdAt ? moment(task.createdAt).format("Do MMM YYYY") : "N/A"}</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    );
};

export default TaskListTable;