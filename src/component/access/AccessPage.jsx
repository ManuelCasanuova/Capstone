import MyLogin from "./MyLogin";
import Dashboard from "../Home/Dashboard";
import { useAuth } from "./AuthContext";


const AccessPage = () => {
  const { user } = useAuth();

  return <>{user ? <Dashboard /> : <MyLogin />}</>;
};

export default AccessPage;