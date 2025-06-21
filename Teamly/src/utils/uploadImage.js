import axiosInstance from "./axiosInstance.js";
import { API_PATHS } from "./apiPaths.js";

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    // Append image file to form data
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data.imageUrl;
    } catch(error) {
        console.error("Error uploading the image: ", error);
        throw error;
    }
};

export default uploadImage;