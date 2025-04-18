import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Navbar/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      seterror("Please enter a valid email");
      return;
    }
    if (!password) {
      seterror("Please enter a password");
      return;
    }
    seterror("");

    //Login API CAll
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      //Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      //Handle Login error response
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        seterror(error.response.data.message);
      } else {
        seterror("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28 px-4">
        <div className="w-full sm:w-96 border rounded bg-white px-6 sm:px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7 text-center">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box w-full mb-4"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary w-full py-2 mt-4">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not registered yet?{""}
              <Link
                to={"/signup"}
                className="font-medium text-blue-500 underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
