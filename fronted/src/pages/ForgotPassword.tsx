import { useForm } from "react-hook-form";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "./Login.css";

interface ForgotForm {
  email: string;
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({ mode: "onBlur" });

const onSubmit = async (data: ForgotForm) => {
  try {
    await api.post("/auth/forgot-password", data);
    alert("Reset link sent to your email");
  } catch (err: any) {
    alert(
      err?.response?.data?.message || 
      "Something went wrong. Please try again."
    );
  }
};


  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-title">Forgot Password</h2>

        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          placeholder="Enter your email"
          className="login-input"
        />
        {errors.email && (
          <p className="error-text">{errors.email.message}</p>
        )}

        <button className="login-button">Send Reset Link</button>

        <p className="auth-switch">
          <Link to="/login" className="auth-link">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
