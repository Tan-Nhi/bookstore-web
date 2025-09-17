import OrderDetail from "@/components/client/order";
import Payment from "@/components/client/order/payment";
import { useCurrentApp } from "@/components/context/app.context";
import { Breadcrumb, Button, Result, Steps } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

const OrderPage = () => {
    const [currentSteps, setCurrentSteps] = useState<number>(0);
    const { setCarts } = useCurrentApp()

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("status") === "success") {
            setCurrentSteps(2);
            localStorage.removeItem("carts");
            setCarts([]);
        }
    }, [location.search]);

    return (
        <>
            <div style={{ background: '#efefef', padding: '20px 0' }}>
                <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>

                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: <Link to={"/"} >Trang chủ</Link>
                            },
                            {
                                title: ' Chi tiết giỏ hàng'
                            }
                        ]}
                    />
                    {!isMobile && <div className="order-step" style={{ marginTop: 10 }}>
                        <Steps
                            size="small"
                            current={currentSteps}
                            style={{ background: "#fff", padding: 10, borderRadius: 5 }}
                            items={[
                                {
                                    title: 'Đơn hàng',
                                },
                                {
                                    title: 'Đặt hàng',
                                },
                                {
                                    title: 'Thanh toán',
                                },
                            ]}
                        />

                    </div>}



                    {currentSteps === 0 &&
                        <OrderDetail setCurrentStep={setCurrentSteps} />

                    }
                    {
                        currentSteps === 1 &&
                        <Payment setCurrentStep={setCurrentSteps} />
                    }
                    {
                        currentSteps === 2 &&
                        <Result
                            status="success"
                            title="Đặt hàng thành công"
                            subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn"
                            extra={[
                                <Button key="home">
                                    <Link to={"/"}>Trang chủ</Link>
                                </Button>,
                                <Button key="history">
                                    <Link to={'/history'} type="primary"> Lịch sử mua hàng</Link>
                                </Button>,
                            ]}
                        />
                    }
                </div>
            </div>


        </>
    )
}

export default OrderPage