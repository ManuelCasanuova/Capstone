import React, { useState } from "react";
import { Button, Image, InputGroup, Container, Row, Col } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import logo from "../../assets/Logo.png"; 

function MyLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setError("Credenziali non valide");
        return;
      }

      const data = await res.json();
      const token = data.token;

      if (token) {
        login(token);
        navigate("/dashboard");
      } else {
        setError("Token mancante nella risposta");
      }
    } catch (err) {
      console.error("Errore login:", err);
      setError("Errore durante l'accesso");
    }
  };

  return (
    <Container fluid className="login-background d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <div className="logo-top-left ">
            <Image src={logo} alt="Logo" fluid style={{ width: "160px" }} />
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
                  <Button variant="outline-secondary" onClick={togglePasswordVisibility} type="button">
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
        </Col>
      </Row>
    </Container>
  );
}

export default MyLogin;


