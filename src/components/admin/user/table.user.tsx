import { deleteUserApi, getUserApi } from '@/services/api';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { dateRangeValidate } from 'services/helper';
import CreateUser from './create.user';
import ImportData from './data/import.data';
import TableDetail from './table.detail';
import UpdateUser from './update.user';



type TSearch = {
    fullName: string;
    email: string,
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const { message, notification } = App.useApp()

    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IUserTable | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false)

    const [isImportData, setIsImportData] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([])

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity,) {
                return (
                    <a href='#'
                        onClick={() => {
                            setDataDetail(entity);
                            setIsDetailOpen(true);
                        }}> {entity._id}  </a>
                )
            },

        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
            /*    render(dom, entity, index, action, schema) {
                    return (
                        <>
                            {dayjs(entity.createdAt).format("DD-MM-YYYY")}
                        </>
                    )
                },
                */
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,

        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <>
                        <EditTwoTone
                            onClick={() => {
                                setIsUpdateOpen(true)
                                setDataUpdate(entity)
                            }}
                            twoToneColor="#d76d09ff"
                            style={{ cursor: 'pointer', marginRight: "15px" }}
                        />

                        <Popconfirm
                            title="Xác nhận xóa User "
                            description="Bạn chắc chắn xóa user này ?"
                            onConfirm={() => handleDeleteUser(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            placement="leftTop"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: 'pointer' }} />
                        </Popconfirm>

                    </>
                )
            }

        }

    ];

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const reFreshTable = () => {
        actionRef.current?.reload();
    }

    const handleDeleteUser = async (id: string) => {
        setIsDeleteUser(true)
        const res = await deleteUserApi(id);
        if (res.data) {
            message.success('Xóa book thành công');
            reFreshTable();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsDeleteUser(false)
    }
    return (
        <>
            <TableDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}

            />
            <CreateUser
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
                reFreshTable={reFreshTable}
            />

            <UpdateUser
                isUpdateOpen={isUpdateOpen}
                setIsUpdateOpen={setIsUpdateOpen}
                reFreshTable={reFreshTable}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <ImportData
                isImportData={isImportData}
                setIsImportData={setIsImportData}
                reFreshTable={reFreshTable}
            />


            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered

                request={async (params, sort, /* filter*/) => {

                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }
                        const createdDateRange = dateRangeValidate(params.createdAtRange);
                        if (createdDateRange) {
                            query += `&createdAt>=${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`
                        }


                    }

                    //default
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;

                    const res = await getUserApi(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        setCurrentDataTable(res.data.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: res.data?.meta.pages,
                        success: true,
                        total: res.data?.meta.total,

                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (
                            <div>{range[0]}-{range[1]} trên {total} rows</div>
                        )
                    }

                }}

                headerTitle="Table user"
                toolBarRender={() => [

                    <CSVLink
                        data={currentDataTable}
                        filename='export-user.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>,


                    <Button
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            setIsImportData(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsCreateOpen(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;