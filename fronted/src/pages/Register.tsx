import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  profileImage: FileList;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: "onBlur", 
  });

  const [preview, setPreview] = useState<string | null>(null);
  const naviagate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profileImage", data.profileImage[0]);

    await api.post("/auth/register", formData);
    alert("Verification email sent and please valid Email and Please login");
    naviagate("/login")

  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-title">Register</h2>

       
        <input
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          placeholder="Name"
          className="login-input"
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}

       
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
        {errors.email && <p className="error-text">{errors.email.message}</p>}

       
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

        
        <input
          type="file"
          {...register("profileImage", {
            required: "Profile image is required",
          })}
          onChange={(e) =>
            setPreview(
              e.target.files ? URL.createObjectURL(e.target.files[0]) : null
            )
          }
        />
        {errors.profileImage && (
          <p className="error-text">{errors.profileImage.message}</p>
        )}

        {preview && <img src={preview} width={80} />}

        <button className="login-button">Register</button>

        
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
