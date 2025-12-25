import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

interface ResetForm {
  password: string;
}

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({ mode: "onBlur" });

  const onSubmit = async (data: ResetForm) => {
    await api.post("/auth/reset-password", {
      token,
      newPassword: data.password,
    });

    alert("Password reset successful");
    navigate("/login");
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-title">Reset Password</h2>

        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          placeholder="New password"
          className="login-input"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message}</p>
        )}

        <button className="login-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
