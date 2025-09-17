import { useCurrentApp } from "@/components/context/app.context";
import { updateUserPasswordApi } from "@/services/api";
import { App, Button, Col, Form, Input, Row } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

type FieldType = {
    email: string;
    oldpass: string;
    newpass: string
}

const ChangePassword = () => {
    const [form] = Form.useForm()
    const { message, notification } = App.useApp()

    const [isSubmit, setIsSubmit] = useState(false);
    const { user } = useCurrentApp()

    useEffect(() => {
        if (user) {
            form.setFieldValue("email", user.email)
        }
    }, [user])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true)
        const res = await updateUserPasswordApi(email, oldpass, newpass);
        if (res && res.data) {
            //update react context
            message.success("Cật nhật mật khẩu thành công");
            form.setFieldValue('oldpass', '')
            form.setFieldValue('newpass', '')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message
            })
        }
        setIsSubmit(false)
    };
    return (
        <>
            <div style={{ minHeight: 400 }}>
                <Row gutter={[16, 16]} justify={'center'}>
                    <Col span={12} xs={24} sm={24} md={12} >

                        <Form
                            name="change-password"
                            form={form}
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"

                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Mật khẩu cũ"
                                name="oldpass"
                                rules={[{ required: true, message: 'Mật khẩu cũ không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Mật khẩu mới"
                                name="newpass"
                                rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button
                                    loading={isSubmit}
                                    type="default" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>



                </Row>

            </div>
        </>
    )
}

export default ChangePassword