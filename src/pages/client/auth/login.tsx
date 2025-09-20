import { useCurrentApp } from "@/components/context/app.context";
import { loginApi } from "@/services/api";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import { App, Button, Col, Divider, Form, FormProps, Input, notification, Row } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


type FieldType = {
    username: string;
    password: string;

};



const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp()
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values;
        setIsSubmit(true)
        const res = await loginApi(username, password);
        setIsSubmit(false)
        if (res.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem("access_token", res.data.access_token);
            message.success("Đăng nhập thành công!")
            if (res.data.user.role === "ADMIN") {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            });

        }

    };



    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            if (!credentialResponse?.credential) {
                notification.error({
                    message: "Không nhận được mã xác thực từ Google",
                    duration: 5
                });
                return;
            }

            const decoded: any = jwtDecode(credentialResponse.credential);

            const { email, sub } = decoded;

            if (!email || !sub) {
                notification.error({
                    message: "Thiếu thông tin email hoặc sub từ Google",
                    duration: 5
                });
                return;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/social-media`,
                {
                    type: "google",
                    email,
                    sub
                },
                {
                    withCredentials: true
                }
            );

            const data = res.data;

            if (data.data) {
                setIsAuthenticated(true);
                setUser(data.data.user);
                localStorage.setItem("access_token", data.data.access_token);
                message.success("Đăng nhập Google thành công!");
                navigate('/');
            } else {
                notification.error({
                    message: "Đăng nhập Google thất bại",
                    description: data.message,
                    duration: 5
                });
            }
        } catch (error: any) {
            notification.error({
                message: "Lỗi khi xử lý đăng nhập Google",
                description: error?.response?.data?.message || error.message,
                duration: 5
            });
        }

    };


    return (
        <>

            <div className="login__page">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">

                            <Row justify={"center"} style={{ marginTop: "30px" }}>
                                <Col xs={24} lg={8} md={8}>
                                    <fieldset style={{
                                        border: "1px solid #ccc",
                                        padding: "20px",
                                        margin: "5px",
                                        borderRadius: "5px",
                                        fontSize: "20px",
                                    }}>
                                        <legend style={{ fontWeight: 700, textAlign: "center" }}>Đăng nhập</legend>
                                        <Form
                                            name="login"
                                            onFinish={onFinish}
                                            autoComplete="off"
                                            layout="vertical"

                                        >

                                            <Form.Item<FieldType>

                                                name="username"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập Email!'
                                                    },
                                                    {
                                                        type: "email",
                                                        message: "Không đúng định dạng email"
                                                    }

                                                ]}
                                            >
                                                <Input prefix={<UserOutlined />} placeholder="Email" />
                                            </Form.Item>
                                            <Form.Item<FieldType>

                                                name="password"

                                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' },
                                                {
                                                    min: 6,
                                                    message: "Mật khẩu phải trên 6 kí tự"
                                                }
                                                ]}
                                            >
                                                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                                            </Form.Item>




                                            <Form.Item label={null}  >
                                                <Button type="primary" htmlType="submit" loading={isSubmit} >
                                                    Submit
                                                </Button>
                                                <Divider>Or</Divider>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleLogin}
                                                        onError={() => {
                                                            notification.error({
                                                                message: "Đăng nhập Google thất bại",
                                                                duration: 5
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                &nbsp;
                                                <p style={{ textAlign: "center" }}>Chưa có tài khoản?  <Link to={"/register"} >Đăng ký Tại Đây </Link>  </p>
                                            </Form.Item>
                                        </Form>
                                    </fieldset>
                                </Col>
                            </Row >
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}

export default LoginPage;