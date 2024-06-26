import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Head from './app/headerApp/Header';
import Reg from './app/regApp/Reg';
import Task from './app/taskApp/Task';
import Meet from './app/meetApp/Meet';
import Team from './app/teamApp/Team';
import CheckReg from './app/regApp/CheckReg';


function App() {
    const navigate = useNavigate();
    
    return (
        <>
            <CheckReg navigate={navigate} />
            <Routes>
                <Route path="/" element={<Head />} />
                <Route path="/reg" element={<Reg />} />
                <Route path="/task" element={<><Task /><Head /></>} />
                <Route path="/meet" element={<><Meet /><Head /></>} />
                <Route path="/team" element={<><Team /><Head /></>} />
            </Routes>
        </>
    );
}

export default App;
