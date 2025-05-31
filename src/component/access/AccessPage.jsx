import { useEffect } from "react";
import { useNavigate } from "react-router";
import MyLogin from "./MyLogin";
import Dashboard from "../Home/Dashboard";
import { useAuth } from "./AuthContext";

const AccessPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.passwordModificata === false) {
        navigate("/cambio-password", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <p>Caricamento in corso...</p>;

  if (user && user.passwordModificata === false) return null;

  return <>{user ? <Dashboard /> : <MyLogin />}</>;
};

export default AccessPage;


