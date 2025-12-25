# 🚀 Full Stack Authentication System

A **complete Full-Stack Authentication & Authorization system** built using **React, Node.js, Express, and MySQL**, featuring secure user registration, login, email verification, JWT-based authentication, role-based access control, and profile management.

This project is designed as a real-world, production-ready auth system suitable for SaaS apps, admin dashboards, and enterprise applications.

## 🧱 Tech Stack

### 🔹 Frontend
- React.js
- TypeScript
- React Router DOM
- React Hook Form
- Axios
- CSS (custom styling)

### 🔹 Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT (JSON Web Tokens)
- Multer (file uploads)
- Nodemailer (email verification)
- Express Validator
- Bcrypt (password hashing)

---

## ✨ Features

### 🔐 Authentication
- User Registration
- Login with JWT
- Secure Password Hashing
- Email Verification Flow
- Forgot Password & Reset Password
- Protected Routes

### 🧑‍💼 Authorization
- Role-Based Access Control (Admin / User)
- Admin-only routes
- Secure middleware validation

### 👤 User Management
- View logged-in user profile
- Update profile details
- Upload profile image 
- View all users (Admin only)
- View user by ID (Admin only)

### 📩 Email
- Email verification on signup
- Secure token-based verification
- Password reset via email

### 📦 File Upload
- Profile image upload using Multer
- Stored locally with proper naming

---

## 📂 Project Structure

```

FullStack_Auth_System/
│
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── models/
│   ├── utils/
│   ├── uploads/
│   ├── config/
│   ├── app.js
│   └── server.js
│
├── fronted/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api/
│   │   └── App.tsx
│   └── public/
│
└── .gitignore

```

---

##  Authentication Flow

1. User registers with email & password  
2. Verification email is sent  
3. User clicks verification link  
4. Account gets activated  
5. User logs in → JWT token generated  
6. Token stored in frontend  
7. Protected routes validated via middleware  
8. Role-based access applied  

---

## Security Measures

- Passwords hashed using **bcrypt**
- JWT-based authentication
- Protected API routes
- Email verification before login
- Role-based access control
- Input validation using **express-validator**

---

##  API Endpoints

### Auth
```

POST   /auth/register
POST   /auth/login
GET    /auth/verify-email/:token
POST   /auth/forgot-password
POST   /auth/reset-password

```

### Users
```

GET    /users/me/profile
PUT    /users/me/profile
GET    /users
GET    /users/:id

```



## ⚙️ Environment Variables

Create a `.env` file inside `Backend/`

```

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=auth_app
JWT_SECRET=your_jwt_secret
JWT_RESET_SECRE=your_Reset_secret
JWT_REFRESH_SECRET=Refresh_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
REDIS_HOST= Redis_Host
REDIS_PORT= Redis_port
REDIS_USERNAME= Redis_username
REDIS_PASSWORD= Redis_password

````


### Backend
```bash
cd Backend
npm install
npm run dev
````

### Frontend

```bash
cd fronted
npm install
npm start
```


## 🚀 Future Enhancements

* Google OAuth Login
* Refresh Token Implementation
* Redis-based session management
* Pagination & search for users
* Deployment using Docker & AWS
* Rate limiting & security hardening


## 👨‍💻 Author

**Srikanth Banoth**
Full-Stack Developer (React | Node.js | MySQL | JWT | Auth Systems)


## ⭐ Why This Project?

This project demonstrates **real-world authentication concepts** including:

* JWT authentication
* Email verification
* Role-Based Access Control (RBAC)
* Secure API design
* Frontend & backend integration
