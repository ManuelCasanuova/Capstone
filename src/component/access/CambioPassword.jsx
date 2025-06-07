import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  InputGroup,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import bgImage from "../../assets/password.png";
import logo from "../../assets/Logo.png"; // Logo in alto a destra

function CambioPassword() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Le nuove password non corrispondono");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(apiUrl + "/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user?.username,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const text = await response.text();
      if (response.ok && text.includes("Password aggiornata correttamente")) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(text || "Errore nel cambio password");
      }
    } catch (err) {
      setError("Errore di rete");
    }
  };

  return (
    <>
     
      <Row className="mt-4 mb-2">
        <Col xs={6}></Col>
        <Col xs={6} className="text-end pe-4">
          <Image src={logo} alt="Logo" style={{ maxWidth: "150px" }} />
        </Col>
      </Row>

     
      <Container
        style={{
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          zIndex: 1,
          position: "relative",
        }}
      >
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">Password aggiornata correttamente</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Password attuale</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => toggleVisibility("old")}
                type="button"
              >
                {showPassword.old ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nuova password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => toggleVisibility("new")}
                type="button"
              >
                {showPassword.new ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Conferma nuova password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => toggleVisibility("confirm")}
                type="button"
              >
                {showPassword.confirm ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="success">
            Salva
          </Button>
        </Form>
      </Container>

  
      <img
        src={bgImage}
        alt="Decorazione cambio password"
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "600px",
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

export default CambioPassword;


