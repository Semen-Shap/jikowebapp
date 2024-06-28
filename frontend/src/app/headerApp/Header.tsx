import { Link } from "react-router-dom";
import './Header.css'

const Head = () => {

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/task">Tasks</Link></li>
                <li><Link to="/meet">Meetings</Link></li>
                <li><Link to="/team">Team</Link></li>
            </ul>
        </nav>
    );
};

export default Head;
