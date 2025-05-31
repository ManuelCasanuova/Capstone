import React, { useState } from "react";
import { Form, Button, Container, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

function CambioPassword() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

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
    console.log("Token usato per cambio password:", token);

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

    if (response.ok) {
      const text = await response.text();
      if (text.includes("Password aggiornata correttamente")) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError("Risposta imprevista: " + text);
      }
    } else {
      const text = await response.text();
      setError(text || "Errore nel cambio password");
    }
  } catch (err) {
    setError("Errore di rete");
  }
};


  return (
    <Container style={{ maxWidth: "500px", marginTop: "80px" }}>
      <h3 className="mb-4">Cambio Password</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Password aggiornata correttamente</Alert>}

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
  );
}

export default CambioPassword;
