import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  InputGroup,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import logo from "../../assets/Logo.png";

function MyLogin() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
     

      if (data.token) {
        login(data.token);
        if (data.changePasswordRequired) {
          navigate("/cambio-password", { state: { username: formData.username } });
        } else {
          login(data.token);

        }
      } else {
        setError("Token mancante nella risposta");
      }
    } catch (err) {
      console.error("Errore login:", err);
      setError("Errore durante l'accesso");
    }
  };

  return (
    <Container fluid className="login-background">
      <div className="logo-top-left d-none d-md-block">
        <Image
          src={logo}
          alt="Logo"
          style={{ width: "160px" }}
          fluid
          className="ms-4 mt-3"
        />
      </div>

      <Row className="login-content-wrapper h-100 align-items-center">
        <Col md={6} className="d-none d-md-flex justify-content-center">
          <div className="slogan-box">
            <div className="slogan-text">
              Tecnologia al servizio della salute,<br />
              per medici e pazienti.
            </div>
          </div>
        </Col>

        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="d-block d-md-none mb-4">
            <Image src={logo} alt="Logo" style={{ width: "120px" }} fluid />
          </div>

          <div className="login-box w-100" style={{ maxWidth: 450 }}>
            <h2 className="text-center mb-4">Accedi</h2>
            {error && <p className="text-danger text-center">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
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
                <label htmlFor="password" className="form-label">
                  Password
                </label>
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
                  <Button
                    variant="outline-secondary"
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
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








