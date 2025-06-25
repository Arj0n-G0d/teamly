import { useParams } from "react-router-dom";
import { getStatusTagColor } from "../../utils/helper.js";
import {useContext, useEffect, useState} from "react";
import Spinner from "../../components/others/Spinner.jsx";
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import InfoBox from "../../components/others/InfoBox.jsx";
import moment from "moment";
import ShowUsers from "../../components/others/ShowUsers.jsx";
import TodoChecklist from "../../components/others/TodoChecklist.jsx";
import Attachment from "../../components/others/Attachment.jsx";
import { UserContext } from "../../context/UserContext.jsx";

const ViewTaskDetails = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [checkLoading, setCheckLoading] = useState(false);
    const [task, setTask] = useState(null);

    const getTaskDetailsById = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
            if(response.data.task) setTask(response.data.task);
        } catch(error) {
            console.error("Error fetching task details", error);
        } finally {
            setLoading(false);
        }
    };
    const handleTodoCheck = async (index) => {
        const taskId = id;
        const todoChecklist = [...task?.todoChecklist];
        console.log(todoChecklist);
        if(todoChecklist && todoChecklist[index]) {
            todoChecklist[index].completed = !todoChecklist[index].completed;

            try {
                setCheckLoading(true);
                const response = await axiosInstance.put(
                    API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
                    { todoChecklist }
                );
                if(response.status === 200) {
                    setTask(response.data.task);
                } else {
                    todoChecklist[index].completed = !todoChecklist[index].completed;
                }
            } catch(error) {
                console.error("Error updating Todo Checklist", error)   ;
                todoChecklist[index].completed = !todoChecklist[index].completed;
            } finally {
                setCheckLoading(false);
            }
        }
    };

    const handleAttachmentLinkClick = (link) => {
        if(!/^https?:\/\//i.test(link)) link = "https://" + link;
        window.open(link, "_blank");
    };

    useEffect(() => {
        if(id) {
            getTaskDetailsById();
        }
    }, []);

    return (
        <>
            { loading ? (
                    <Spinner />
                ) : (
                    <DashboardLayout activeMenu={ "My Tasks" }>
                        <div className="mt-5">
                            { task && (
                                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                                    <div className="form-card col-span-3">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-sm md:text-xl font-medium">
                                                { task?.title }
                                            </h2>

                                            <div className={ `text-[15px] font-medium ${ getStatusTagColor(task?.status) } px-4 py-0.5 rounded` }>
                                                { task?.status }
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <InfoBox label={ "Description" } value={ task?.description } />
                                        </div>
                                        { task?.createdBy &&
                                            <div className="mt-4">
                                                <label className="font-medium text-xs text-gray-500">Assigned By</label>
                                                <div className="flex justify-between">
                                                    <div className="flex justify-center">
                                                        <div className="text-[15px] font-medium text-white bg-primary px-3 py-0.5 rounded">
                                                            { task?.createdBy.name || "" }
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        { task?.createdBy.email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                        <div className="grid grid-cols-12 gap-4 mt-4">
                                            <div className="col-span-6 md:col-span-4">
                                                <InfoBox label={ "Priority" } value={ task?.priority } />
                                            </div>
                                            <div className="col-span-6 md:col-span-4">
                                                <InfoBox label={ "Due Date" } value={ task?.dueDate ? moment(task?.dueDate).format("Do MMM YYYY") : "N/A" } />
                                            </div>
                                            <div className="col-span-6 md:col-span-4">
                                                <label className="text-xs font-medium text-slate-500">
                                                    Assigned To
                                                </label>
                                                <ShowUsers selectedUsers={ task?.assignedTo || [] } maxVisible={ 5 }/>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <label className="text-xs font-medium text-slate-500">
                                                Todo Checklist
                                            </label>
                                            { task?.todoChecklist?.map((item, index) => (
                                                <TodoChecklist
                                                    key={ index }
                                                    text={ item.text }
                                                    isChecked={ item.completed }
                                                    disabled={ checkLoading }
                                                    onChange={ () => handleTodoCheck(index) }
                                                />
                                            )) }
                                        </div>

                                        { task?.attachments?.length > 0 && (
                                            <div className="mt-2">
                                                <label className="text-xs font-medium text-slate-500">
                                                    Attachments
                                                </label>

                                                { task?.attachments?.map((link, index) => (
                                                    <Attachment
                                                        key={ index }
                                                        link={ link }
                                                        index={ index }
                                                        onClick={ () => handleAttachmentLinkClick(link) }
                                                    />
                                                ) ) }
                                            </div>
                                        ) }
                                    </div>
                                </div>
                            ) }
                        </div>
                    </DashboardLayout>
                ) }
        </>
    );
};

export default ViewTaskDetails;