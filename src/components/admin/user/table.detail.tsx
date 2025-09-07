import { FORMATE_DATE } from "services/helper";
import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

type TProps = {
    isDetailOpen: boolean;
    dataDetail: IUserTable | null
    setIsDetailOpen: (v: boolean) => void;
    setDataDetail: (v: IUserTable | null) => void;
}

const TableDetail = (props: TProps) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail } = props


    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetail?.avatar}`

    return (
        <>
            <Drawer
                title="Chi tiết User"
                closable={{ 'aria-label': 'Close Button' }}
                width={"50vw"}
                onClose={() => {
                    setDataDetail(null);
                    setIsDetailOpen(false)
                }}
                open={isDetailOpen}
            >
                <Descriptions
                    title="Thông tin Uer"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{dataDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataDetail?.phone}</Descriptions.Item>

                    <Descriptions.Item label="Role" >
                        <Badge status="processing" text={dataDetail?.role} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Avatar" >
                        <Avatar size={40} src={avatarURL}>User</Avatar>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {dayjs(dataDetail?.createdAt).format(FORMATE_DATE)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At">
                        {dayjs(dataDetail?.updatedAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer >
        </>
    )
}
export default TableDetail