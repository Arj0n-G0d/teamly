import TEAMLY from "../../assets/teamly.png";

const Logo = ({ className }) => {
    return <img src={ TEAMLY } alt="Teamly Logo" className={ `max-w-[120px] w-full h-auto ${className}` } />
};

export default Logo;
