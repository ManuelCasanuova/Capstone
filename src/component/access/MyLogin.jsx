import React, { useState } from "react";
import { Button, Image, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchLogin } from "../../redux/actions";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import logo from "../../assets/Logo.png";

function MyLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    dispatch(fetchLogin(formData.username, formData.password, navigate));
  };

  return (
    <div className="login-background">
      <div className="logo-top-left">
        <Image src={logo} alt="Logo" fluid style={{ width: "160px" }} />
      </div>

      <div className="login-content-wrapper">
        <div className="slogan-box">
          <h3 className="slogan-text">
            Tecnologia al servizio della cura,<br />per medici e pazienti.
          </h3>
        </div>

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
              <InputGroup>
                <input
                  id="password"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
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