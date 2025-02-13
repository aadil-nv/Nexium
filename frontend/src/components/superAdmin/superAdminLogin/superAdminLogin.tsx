import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slices/superAdminSlice";
import { loginSuperAdmin } from "../../../api/superAdminApi";
import { AxiosError } from "axios";
import nabarLogo from "../../../assets/landingPageAssets/NavbarLogo.png"
import {useTheme} from "../../../components/landing/landingPage/theme-provider";


interface IFormInputs {
  email: string;
  password: string;
}

const SuperAdminLogin: React.FC = () => {
  // const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { theme } = useTheme();


  const handleLogin = async (values: IFormInputs) => {
    setLoading(true);
    try {
      await loginSuperAdmin(values);
      dispatch(login({ role: "superAdmin", isAuthenticated: true }));
      message.success("Login successful!");
      navigate("/super-admin/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        message.error(error.response?.data?.message || "Login failed. Please check your credentials.");
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex items-center justify-center p-4`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden"
      >
        <div className="w-full md:w-3/5 p-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-start"
          >
            <img 
              src={nabarLogo} 
              alt="Super Admin Logo" 
              className="w-32 h-auto object-contain"
            />
          </motion.div>

          <div className="mt-12 mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-800"
            >
              Super Admin Portal
            </motion.h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <Form
            form={form}
            onFinish={handleLogin}
            layout="vertical"
            className="max-w-md mx-auto px-4"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Super Admin Email"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                size="large"
                className="rounded-lg"
                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                icon={!loading && <ArrowRightOutlined />}
              >
                <span className="mr-2">Access Dashboard</span>
              </Button>
            </Form.Item>
          </Form>
        </div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-2/5 bg-blue-600 text-white p-8 flex flex-col justify-center items-center"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
          <div className="w-24 h-1 bg-white text-white mb-6"></div>
          <p className="text-lg text-center mb-8 text-white ">
            Manage your platform with enhanced administrative controls
          </p>
          <Button
            ghost
            href="/"
            size="large"
            className="rounded-full border-2 hover:bg-white hover:text-blue-600 transition-colors"
          >
            Return Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuperAdminLogin;