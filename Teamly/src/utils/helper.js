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
    switch(status) {
        case "Completed": return "bg-green-100 text-green-500 border border-green-200"
        case "Pending": return "bg-yellow-100 text-yellow-500 border border-yellow-200"
        case "In Progress": return "bg-cyan-100 text-cyan-500 border border-cyan-200"
        default: return "bg-gray-100 text-gray-500 border border-gray-200"
    }
};

const getPriorityBadgeColor = (priority) => {
    switch(priority) {
        case "High": return "bg-red-100 text-red-500 border border-red-200"
        case "Moderate": return "bg-orange-100 text-orange-500 border border-orange-200"
        case "Low": return "bg-green-100 text-green-500 border border-green-200"
        default: return "bg-gray-100 text-gray-500 border border-gray-200"
    }
};

const getStatusTagColor = getStatusBadgeColor;
const getPriorityTagColor = getPriorityBadgeColor;

const getStatusBorderColor = (status) => {
    switch(status) {
        case "Completed": return "border-green-200"
        case "Pending": return "border-yellow-200"
        case "In Progress": return "border-cyan-200"
        default: return "border-gray-200"
    }
};

const getPriorityBorderColor = (priority) => {
    switch(priority) {
        case "High": return "border-red-200"
        case "Moderate": return "border-orange-200"
        case "Low": return "border-green-200"
        default: return "border-gray-200"
    }
};

export { validateEmail, addThousandsSeparator,
    getStatusBadgeColor, getPriorityBadgeColor,
    getStatusTagColor, getPriorityTagColor,
    getStatusBorderColor, getPriorityBorderColor
};