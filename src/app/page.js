"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(()=>{
    document.title = "SMS Login";
}, [])

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  }

  let message = '';
  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) message = "Username is required.";
        break;

      case 'password':
        if (!value) message = "Password is required.";
        break;

      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: message }));
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};

    Object.keys(formData).forEach((key) => {
      let message = "";
      switch (key) {
        case "username":
          if (!formData[key]) message = "Username is required.";
          break;
        case "password":
          if (!formData[key]) message = "Password is required.";
          break;
        default:
          break;
      }
      setErrors((prevErrors) => ({ ...prevErrors, [key]: message }));
      if (message) {
        formErrors[key] = message;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', {
        username: formData.username,
        password: formData.password
      });

      if (response.status === 200) {
        toast.success('Login Successful!');
        router.push('/sms');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Invalid username or password');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };
  return (
    <>
      <div className='bg-gradient-primary' style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-9">
              <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                    <div className="col-lg-6">
                      <div className="p-5">
                        <div className="text-center">
                          <h1 className="h4 text-gray-900 mb-4">Admin Login</h1>
                        </div>

                        <form className="user" onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control form-control-user"
                              id="username"
                              placeholder="Username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                            />
                            {errors.username && <span className="danger text-xs">{errors.username}</span>}
                          </div>
                          <div className="form-group">
                            <div className="mb-3">
                              <div className="password-container">
                                <input
                                  type={passwordVisible ? 'text' : 'password'}
                                  className="form-control form-control-user"
                                  id="password"
                                  placeholder="Password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                />
                                <i
                                  className={`fa-solid ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} icon password-icon`}
                                  onClick={() => setPasswordVisible(!passwordVisible)}
                                  style={{ cursor: 'pointer' }}
                                ></i>
                                {errors.password && <span className="danger text-xs">{errors.password}</span>}
                              </div>
                            </div>
                          </div>

                          <input
                            type="submit"
                            id="admin"
                            className="btn btn-primary w-100"
                            value="Submit"
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLogin;