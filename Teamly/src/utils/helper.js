import axiosInstance from "./axiosInstance.js";

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const getDummyCredentials = async () => {
    const response = await axiosInstance.get("https://random-indian-name-generator.vercel.app/api/random_name");
    const random3Digit = Math.floor(Math.random() * 900) + 100;
    const { firstName, lastName } = response.data;

    return {
        fullName: `${firstName} ${lastName}`,
        email: `${firstName}.${lastName}.example.com`,
        password: `${firstName}${random3Digit}`
    };
}

export { validateEmail, getDummyCredentials };