import React, { use, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchLogin } from "../../redux/actions";

function MyLogin() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    dispatch(fetchLogin(formData.username, formData.password));

    setTimeout(() => {
      const myToken = localStorage.getItem("token");
      if (myToken) {
        setToken(myToken);
        setSuccess(true);
      } else {
        setError("Token not found");
        setSuccess(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div>
      <h2 className="text-center">Accedi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <div className=" d-flex justify-content-between my-2">
            <label className="">Username:</label>
            <input
              className="rounded-2 border border-secondary "
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className=" d-flex justify-content-between my-2">
            <label>Password:</label>
            <input
              className="rounded-2 border border-secondary "
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-between my-2">
          <Button type="submit" variant="outline-success">
            Login
          </Button>
          
        </div>
      </form>
    </div>
  );
}
export default MyLogin;