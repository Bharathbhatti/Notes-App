import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Navbar/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      seterror("Please enter a name");
      return;
    }

    if (!validateEmail(email)) {
      seterror("Please enter a valid email");
      return;
    }
    if (!password) {
      seterror("Please enter a password");
      return;
    }
    seterror("");

    //SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      //Handle successful Signin response
      if (response.data && response.data.error) {
        seterror(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      //Handle Signup error response
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
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7 text-center">Sign Up</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box w-full mb-4"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />

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
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="font-medium text-blue-500 underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
