import { updateUserApi } from "@/services/api";
import { App, Divider, Form, Input, Modal } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

type TProps = {
    isUpdateOpen: boolean;
    setIsUpdateOpen: (v: boolean) => void
    reFreshTable: () => void;
    dataUpdate: IUserTable | null;
    setDataUpdate: (v: IUserTable | null) => void
}

type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
};

const UpdateUser = (props: TProps) => {
    const { isUpdateOpen, setIsUpdateOpen, reFreshTable, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { message, notification } = App.useApp()

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
            })
        }
    }, [dataUpdate])

    const handleUpdate: FormProps<FieldType>['onFinish'] = async (values) => {

        const { _id, fullName, phone } = values;
        setIsSubmit(true)
        const res = await updateUserApi(_id, fullName, phone);
        if (res && res.data) {
            message.success("Cập nhật user thành công!")
            form.resetFields();
            setIsUpdateOpen(false);
            setDataUpdate(null);
            reFreshTable();
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
                title="Cập nhật người dùng"
                open={isUpdateOpen}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setIsUpdateOpen(false);
                    setDataUpdate(null)
                    form.resetFields()
                }
                }
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    name="Update User"
                    onFinish={handleUpdate}
                    autoComplete="off"
                    layout="vertical"
                    form={form}

                >
                    <Form.Item<FieldType>
                        label="_id"
                        name="_id"
                        hidden
                    >
                        <Input disabled />
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
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Tên hiển thị"
                        name="fullName"

                        rules={[{ required: true, message: 'Vui lòng nhập Họ và tên!' }]}
                    >
                        <Input />
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

export default UpdateUser;