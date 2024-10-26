import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineMail, AiOutlineLock, AiOutlineEyeInvisible } from 'react-icons/ai';
import Loading from '../../Loading/Loading.tsx';
import './Login.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { HandleLogin } from '../../ApiService/ApiService.ts';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Redux/slices/UserSlice.ts';

const Login: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch()
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Invalid email format'
      )
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = async (values: { email: string; password: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setIsLoading(true);
    try {
      const response=await HandleLogin(values);
      if(response){
      dispatch(setUser(response.data.user))
      toast.success('Logined Successfully')
        navigate('/home');}
        else{
          toast.error('Please Register your Account')
        }
      
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center background-image">
      <div className="relative border-transparent rounded-lg shadow-lg p-8 w-full max-w-md bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Blog.in Login</h2>
        <img src="/login.avif" alt="Login" className="w-full h-auto mb-4" />
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4 relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                />
                <AiOutlineMail className="absolute top-3 right-3 text-gray-400" />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4 relative">
                <Field
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 bg-transparent text-gray-700"
                />
                <AiOutlineLock className="absolute top-3 right-10 text-gray-400" />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-3 right-3 text-gray-400"
                >
                  <AiOutlineEyeInvisible />
                </button>
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="flex justify-center mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex justify-center mb-4">

        </div>
        <div className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;