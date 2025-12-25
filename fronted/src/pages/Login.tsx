import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onBlur",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const onSubmit = async (data: LoginForm) => {
    const res = await api.post("/auth/login", data);
    login(res.data.accessToken);
    navigate("/users");
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-title">Login</h2>

        
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          placeholder="Email"
          className="login-input"
        />
        {errors.email && (
          <p className="error-text">{errors.email.message}</p>
        )}

        
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          placeholder="Password"
          className="login-input"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}

        <button className="login-button">Login</button>

        
        <p className="auth-switch">
          No account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>

        <p className="auth-switch">
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Login;
