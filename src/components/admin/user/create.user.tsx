import { createUserApi } from "@/services/api";
import { App, Divider, Form, Input, Modal, notification } from "antd";
import { FormProps } from "antd/lib";
import { useState } from "react";

type TProps = {
    isCreateOpen: boolean;
    setIsCreateOpen: (v: boolean) => void
    reFreshTable: () => void;
}

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;

};
const CreateUser = (props: TProps) => {
    const { isCreateOpen, setIsCreateOpen, reFreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { message } = App.useApp()

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {

        const { fullName, email, password, phone } = values;
        setIsSubmit(true)
        const res = await createUserApi(fullName, email, password, phone);


        if (res && res.data) {
            message.success("Thêm mới thành công!")
            form.resetFields();
            setIsCreateOpen(false)
            reFreshTable()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)

    };

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isCreateOpen}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setIsCreateOpen(false);
                    form.resetFields()
                }
                }
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    name="Create User"
                    onFinish={handleSubmit}
                    autoComplete="off"
                    layout="vertical"
                    form={form}

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
                </Form>
            </Modal >
        </>
    )
}

export default CreateUser;