import { App, Button, Col, Divider, Form, FormProps, Input, Row } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "services/api";

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;

};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp()
    const navigate = useNavigate();


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)

        const { fullName, email, password, phone } = values;
        const res = await registerApi(fullName, email, password, phone);
        if (res.data) {
            message.success("Đăng ký thành công")
            navigate('/login')
        } else {
            message.error("Đăng ký thất bại")
        }
        setIsSubmit(false)
    };

    return (
        <>
            <div className="register__page">
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
                                        <legend style={{ fontWeight: 700, textAlign: "center" }}>Đăng Ký Tài Khoản</legend>
                                        <Form
                                            name="register"
                                            onFinish={onFinish}
                                            autoComplete="off"
                                            layout="vertical"

                                        >
                                            <Form.Item<FieldType>
                                                label="Họ và tên"
                                                name="fullName"

                                                rules={[{ required: true, message: 'Vui lòng nhập Họ và tên!' }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.Item<FieldType>
                                                label="Email"
                                                name="email"

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


                                            <Form.Item<FieldType>
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' },
                                                {
                                                    pattern: /^((\+84)|0)(3|5|7|8|9)[0-9]{8}$/,
                                                    message: "Số điện thoại không hợp lệ!"
                                                },

                                                ]}
                                            >
                                                <Input
                                                    placeholder="VD: 09876547281 hoặc +849876547281"
                                                    style={{ width: "100%" }}
                                                    max={13}
                                                    min={10}
                                                />
                                            </Form.Item>

                                            <Form.Item label={null} >
                                                <Button type="primary" htmlType="submit" loading={isSubmit} >
                                                    Submit
                                                </Button>
                                                <Divider>Or</Divider>
                                                <p style={{ textAlign: "center" }}>Đã có tài khoản?  <Link to={"/login"} >Đăng nhập Tại Đây </Link>  </p>
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

export default RegisterPage;