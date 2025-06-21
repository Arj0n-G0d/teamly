const InfoCard = ({ Icon, label, value, color }) => {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full ${color}`}>
                {Icon && <Icon className="text-white text-sm md:text-base" />}
            </div>
            <p className="text-xs md:text-sm text-gray-500">
                <span className="text-sm md:text-base text-black font-semibold">{value}</span> {label}
            </p>
        </div>
    );
};

export default InfoCard;