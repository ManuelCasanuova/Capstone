import { Container } from "react-bootstrap"
import MyLogin from "./MyLogin";
import Dashboard from "../Home/Dashboard";

const AccessPage = () => {
    
        const token = localStorage.getItem("token");    
        return <>{token ? <Dashboard /> : <MyLogin />}</>;
    
    }
export default AccessPage;  