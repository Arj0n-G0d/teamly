import axiosInstance from "./axiosInstance.js";

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const addThousandsSeparator = (num) => {
    if(num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger
};

const getStatusBadgeColor = (status) => {
    switch (status) {
        case "Completed":
            return "bg-emerald-100 text-emerald-700 border border-emerald-300";
        case "In Progress":
            return "bg-indigo-100 text-indigo-700 border border-indigo-300";
        case "Pending":
            return "bg-amber-100 text-amber-700 border border-amber-300";
        default:
            return "bg-zinc-100 text-zinc-700 border border-zinc-300";
    }
};

const getPriorityBadgeColor = (priority) => {
    switch (priority) {
        case "High":
            return "bg-rose-100 text-rose-700 border border-rose-300";
        case "Moderate":
            return "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-300";
        case "Low":
            return "bg-cyan-100 text-cyan-700 border border-cyan-300";
        default:
            return "bg-zinc-100 text-zinc-700 border border-zinc-300";
    }
};

const getStatusTagColor = getStatusBadgeColor;
const getPriorityTagColor = getPriorityBadgeColor;

const getStatusBorderColor = (status) => {
    switch (status) {
        case "Completed": return "border-emerald-300";
        case "In Progress": return "border-indigo-300";
        case "Pending": return "border-amber-300";
        default: return "border-zinc-300";
    }
};

const getPriorityBorderColor = (priority) => {
    switch (priority) {
        case "High": return "border-rose-300";
        case "Moderate": return "border-fuchsia-300";
        case "Low": return "border-cyan-300";
        default: return "border-zinc-300";
    }
};



export { validateEmail, addThousandsSeparator,
    getStatusBadgeColor, getPriorityBadgeColor,
    getStatusTagColor, getPriorityTagColor,
    getStatusBorderColor, getPriorityBorderColor
};