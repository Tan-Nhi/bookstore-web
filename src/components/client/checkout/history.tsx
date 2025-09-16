import { getHistoryApi } from "@/services/api";
import { FORMATE_DATE_VN } from "@/services/helper";
import { App, Divider, Drawer, Table, TableProps, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const HistoryPage = () => {

    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => <>{index + 1}</>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'CreatedAt',
            render: (item) => {
                return dayjs(item).format(FORMATE_DATE_VN)
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item,) => {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency', currency: 'VND',
                }).format(item || 0)

            }
        },

        {
            title: 'Trạng thái',
            render: () => (
                <Tag color="green">
                    Thành công
                </Tag>
            )
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <a onClick={() => {
                    setOpenDetail(true);
                    setDataDetail(record)
                }} href="#">
                    Xem chi tiết
                </a>
            ),
        },
    ];

    const [dataHistory, setDataHistory] = useState<IHistory[]>([])
    const [loading, setloading] = useState<boolean>(true);

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);

    const { notification } = App.useApp()

    useEffect(() => {
        const fetchData = async () => {
            setloading(true)
            const res = await getHistoryApi();
            if (res && res.data) {
                setDataHistory(res.data);
            } else {
                notification.error({
                    message: "Có lỗi xảy ra!",
                    description: res.message
                })
            }
            setloading(false)
        }
        fetchData()
    }, [])


    return (
        <>
            <div style={{ margin: '50px' }}>
                <div>Lịch sử mua hàng</div>
                <Divider />
                <Table
                    bordered
                    columns={columns}
                    dataSource={dataHistory}
                    rowKey={'_id'}
                    loading={loading}
                />;
                <Drawer
                    title="Chi tiết đơn hàng"
                    onClose={() => {
                        setOpenDetail(false);
                        setDataDetail(null)
                    }}
                    open={openDetail}
                >
                    {
                        dataDetail?.detail?.map((item, index) => {
                            return (
                                <ul key={index}>
                                    <li>
                                        Tên sách: {item.bookName}
                                    </li>
                                    <br />
                                    <li>
                                        Số lượng: {item.quantity}
                                    </li>
                                    <Divider />
                                </ul>
                            )
                        })
                    }

                </Drawer>
            </div>
        </>
    )
}

export default HistoryPage