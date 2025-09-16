import { Modal, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import ChangePassword from "./change.password";
import UserInfo from "./user.info";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void
}

const ManagerAccount = (props: IProps) => {
    const { openModal, setOpenModal } = props;

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: 'Cập nhật thông tin',
            children: <UserInfo />,
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />,
        },
    ];

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={openModal}
                onCancel={() => {
                    setOpenModal(false)
                }}
                footer={null}
                width={'70vw'}

            >
                <Tabs defaultActiveKey="1" items={items} />
            </Modal>


        </>
    )
}

export default ManagerAccount