import React, { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchLogin } from "../../redux/actions";
import logo from "../../assets/Logo.png";


function MyLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    dispatch(fetchLogin(formData.username, formData.password));

    setTimeout(() => {
      const myToken = localStorage.getItem("token");
      if (myToken) {
        setToken(myToken);
      } else {
        setError("Token not found");
      }
    }, 1000);
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="login-background">
      {/* Logo in alto a sinistra */}
      <div className="logo-top-left">
        <Image src={logo} alt="Logo" fluid style={{ width: "160px" }} />
      </div>
  
      {/* Contenitore con slogan + login affiancati */}
      <div className="login-content-wrapper">
        {/* Slogan a sinistra */}
        <div className="slogan-box">
          <h3 className="slogan-text">
            Tecnologia al servizio della cura,<br />per medici e pazienti.
          </h3>
        </div>
  
        {/* Form a destra */}
        <div className="login-box">
          <h2 className="text-center mb-4">Accedi</h2>
          {error && <p className="text-danger text-center">{error}</p>}
  
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                className="form-control"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                className="form-control"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
  
            <div className="d-grid">
              <Button type="submit" variant="success" size="lg">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyLogin;