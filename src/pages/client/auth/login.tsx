import { useCurrentApp } from "@/components/context/app.context";
import { loginApi } from "@/services/api";
import { App, Button, Col, Divider, Form, FormProps, Input, notification, Row } from "antd";
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
            navigate('/')
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
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
                                                label="Email"
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
                                                <Input />
                                            </Form.Item>
                                            <Form.Item<FieldType>
                                                label="Mật khẩu"
                                                name="password"

                                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' },
                                                {
                                                    min: 6,
                                                    message: "Mật khẩu phải trên 6 kí tự"
                                                }
                                                ]}
                                            >
                                                <Input.Password />
                                            </Form.Item>




                                            <Form.Item label={null} >
                                                <Button type="primary" htmlType="submit" loading={isSubmit} >
                                                    Submit
                                                </Button>
                                                <Divider>Or</Divider>
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