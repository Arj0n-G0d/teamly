import TEAMLY_LOGO from "../../assets/teamly-logo.png";

const Spinner = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center z-50">
                <img
                    src={ TEAMLY_LOGO }
                    alt="Loading..."
                    className="w-16 h-16 animate-bounce"
                />
            </div>
        </div>
    );
};

export default Spinner;