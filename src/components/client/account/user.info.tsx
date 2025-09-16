import { useCurrentApp } from "@/components/context/app.context";
import { updateUserInfoApi, uploadFileApi } from "@/services/api";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Col, Form, FormProps, Input, Row } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { Upload, UploadFile } from "antd/lib";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useEffect, useState } from "react";

type FieldType = {
    _id: string;
    phone: string;
    email: string;
    fullName: string;
}

const UserInfo = () => {
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { user, setUser } = useCurrentApp()
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? '');

    const urlAvatar = ` ${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar} `
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                _id: user.id,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
            })
        }
    }, [user])

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options
        const file = options.file as UploadFile;
        const res = await uploadFileApi(file, "avatar");
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            setUserAvatar(newAvatar)

            if (onSuccess) {
                onSuccess('ok')
            }
        } else {
            message.error(res.message)
        }
    };

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== 'uploading') {
                console.log();
            }
            if (info.file.status === 'done') {
                message.success("Upload file thành công");
            } else if (info.file.status === 'error') {
                message.error('Upload file thất bại!');
            }
        },
    };
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, phone, _id } = values;
        setIsSubmit(true)
        const res = await updateUserInfoApi(_id, userAvatar, fullName, phone);
        if (res && res.data) {
            //update react context
            setUser({
                ...user!,
                avatar: userAvatar,
                fullName,
                phone
            })
            message.success("Cật nhật thông tin thành công");
            //force renew token
            localStorage.removeItem("access_token");
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
            <div style={{ minHeight: 400 }}>
                <Row justify={'center'} style={{ alignItems: 'center' }}>
                    <Col xs={24} sm={24} md={12}>
                        <Row gutter={[30, 30]} justify={'center'} >
                            <Col span={24} >
                                <Avatar
                                    size={{ xs: 64, sm: 80, md: 90, lg: 128, xl: 160, xxl: 200 }}
                                    icon={<AntDesignOutlined />}
                                    src={urlAvatar}
                                    shape="circle"
                                />
                            </Col>
                            <Col span={24}>
                                <Upload {...propsUpload}>
                                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                                </Upload>

                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <br />
                        <Form
                            name="user-info"
                            form={form}
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >

                            <Form.Item<FieldType>
                                hidden
                                labelCol={{ span: 24 }}
                                label="_id"
                                name="_id"
                            >
                                <Input hidden disabled />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}

                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Tên hiển thị"
                                name="fullName"
                                rules={[{ required: true, message: 'Tên hiện thị không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Số điện thoaị"
                                name="phone"
                                rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                            >
                                <Input />
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

export default UserInfo