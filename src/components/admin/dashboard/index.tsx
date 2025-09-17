import { getDashboardApi } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const AdminDashBoard = () => {
    const [dataDashBoard, setDataDashBoard] = useState({
        countOrder: 0,
        countUser: 0,
        countBook: 0
    })

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashboardApi();
            if (res && res.data) setDataDashBoard(res.data);
        }
        initDashboard()
    }, [])
    const formatter = (value: any) => <CountUp end={value} separator="," />
    return (
        <>
            <Row gutter={[40, 40]}>
                <Col span={8}>
                    <Card title='' bordered={false}>
                        <Statistic
                            title="Tổng Users"
                            value={dataDashBoard.countUser}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title='' bordered={false}>
                        <Statistic
                            title="Tổng Đơn Hàng"
                            value={dataDashBoard.countOrder}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title='' bordered={false}>
                        <Statistic
                            title="Tổng Books"
                            value={dataDashBoard.countBook}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AdminDashBoard;