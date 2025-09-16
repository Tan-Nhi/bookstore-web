import { useCurrentApp } from "@/components/context/app.context";
import { createOrderApi } from "@/services/api";
import { DeleteTwoTone } from "@ant-design/icons";
import { App, Button, Col, Divider, Empty, Form, Input, InputNumber, Radio, Row, Space } from "antd";

import { FormProps } from "antd/lib";
import axios from "axios";
import { useEffect, useState } from "react";

interface IProps {
    setCurrentStep: (v: number) => void
}

type TUserMethod = "COD" | "BANKING";

type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: string;
}

const { TextArea } = Input;
const Payment = (props: IProps) => {
    const { setCurrentStep } = props

    const { carts, setCarts, user } = useCurrentApp()
    const [totalPrice, setTotalPrice] = useState(0);

    const [form] = Form.useForm()
    const { message, notification } = App.useApp()

    const [isSubmit, setIsSubmit] = useState<boolean>(false)

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD" as TUserMethod
            })
        }
    }, [user])

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0)
        }
    }, [carts])

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem('carts');
        if (cartStorage) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];

            const newCarts = carts.filter(item => item._id !== _id)

            localStorage.setItem("carts", JSON.stringify(newCarts));

            //sync React Context
            setCarts(newCarts)
        }
    }

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        const { address, fullName, method, phone } = values;

        // Lấy thông tin chi tiết giỏ hàng
        const detail = carts.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.detail.mainText
        }));

        if (method === "BANKING") {
            try {
                setIsSubmit(true);
                const orderRes = await createOrderApi(fullName, address, phone, totalPrice, method, detail);

                if (orderRes.data) {
                    const orderId = orderRes.data._id;

                    const res = await axios.post(`${import.meta.env.VITE_VNPAY_URL}/order/create_payment_url`, {
                        amount: totalPrice,
                        orderId: orderId,
                        bankCode: "",
                        language: "vn"
                    });
                    if (res.data?.paymentUrl) {
                        localStorage.removeItem("carts");
                        setCarts([]);
                        window.location.href = res.data.paymentUrl;
                    } else {
                        notification.error({
                            message: "Không tạo được link thanh toán VNPay",
                        });
                    }
                } else {
                    notification.error({
                        message: "Không tạo được đơn hàng",
                    });
                }
            } catch (error: any) {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: error.message || "Lỗi không xác định",
                });
            } finally {
                setIsSubmit(false);
            }

            return; // 
        }

        //
        try {
            setIsSubmit(true);
            const res = await createOrderApi(fullName, address, phone, totalPrice, method, detail);

            if (res.data) {
                localStorage.removeItem("carts");
                setCarts([]);
                message.success("Mua hàng thành công");
                setCurrentStep(2);
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5,
                });
            }
        } catch (error: any) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: error.message || "Lỗi không xác định",
            });
        } finally {
            setIsSubmit(false);
        }
    };

    const handleOnChangeInput = (value: number, book: IBookTable) => {
        if (!value || +value < 1) return;
        if (!isNaN(+value)) {
            //update localstorage
            const cartStorage = localStorage.getItem('carts');
            if (cartStorage && book) {
                //update
                const carts = JSON.parse(cartStorage) as ICart[];

                //check exits
                let isExistIndex = carts.findIndex(c => c._id === book._id);
                if (isExistIndex > -1) {
                    carts[isExistIndex].quantity = +value;
                }

                localStorage.setItem("carts", JSON.stringify(carts));
                setCarts(carts)
            }
        }
    }

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col md={16} xs={24}>
                    {carts.length > 0 ?
                        carts.map((item, index) => {
                            const currentBookPrice = item.detail.price ?? 0;
                            return (
                                <div className="order-book" key={`index-${index}`}>
                                    <div className="book-content">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`} alt={item.detail.mainText} />
                                        <div className="title">
                                            {item.detail.mainText}
                                        </div>
                                        <div className="price">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency', currency: 'VND',
                                            }).format(currentBookPrice)}
                                        </div>
                                        <div className="quantity">
                                            <InputNumber
                                                onChange={(value) => handleOnChangeInput(value as number, item.detail)}
                                                value={item.quantity}
                                                className="custom-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="action">
                                        <div className="sum">
                                            Tổng:  {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency', currency: 'VND',
                                            }).format(item.detail.price ?? 0)}

                                        </div>
                                        <DeleteTwoTone
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRemoveBook(item._id)}
                                            twoToneColor='#eb2f96'
                                            className="btn-delete_cart"
                                        />
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <Empty description="Không có sản phẩm  trong giỏ hàng" />
                        </div>
                    }
                    <div>
                        <span style={{ cursor: 'pointer' }}
                            onClick={() => props.setCurrentStep(0)}
                        >Quay trở lại
                        </span>
                    </div>
                </Col>
                <Col md={8} xs={24}>
                    <Form
                        form={form}
                        name="payment-form"
                        onFinish={handlePlaceOrder}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <div className="order-sum">
                            <Form.Item<FieldType>
                                label='Hình thức thanh toán'
                                name='method'
                            >
                                <Radio.Group>
                                    <Space direction="vertical">
                                        <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                                        <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                                    </Space>
                                </Radio.Group>


                            </Form.Item>


                            <Form.Item<FieldType>
                                label='Họ và tên'
                                name='fullName'
                                rules={[
                                    { required: true, message: 'Họ và tên không được để trống!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item<FieldType>
                                label='Số điện thoại'
                                name='phone'
                                rules={[
                                    { required: true, message: 'Số điện thoại không được để trống!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label='Địa chỉ nhận hàng'
                                name='address'
                                rules={[
                                    { required: true, message: 'Địa chỉ không được để trống!' }
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <div className="calculate">
                                <span>Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency', currency: 'VND',
                                    }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: '10px 0' }} />
                            <div className="calculate">
                                <span>Tổng tiền</span>
                                <span className="sum-final">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency', currency: 'VND',
                                    }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: '10px 0' }} />
                            <Button
                                color="danger"
                                htmlType="submit"
                                variant="solid"
                                loading={isSubmit}
                            >
                                Đặt hàng ({carts.length ?? 0})
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default Payment