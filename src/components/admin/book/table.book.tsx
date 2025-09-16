import { deleteBookApi, getBookApi } from "@/services/api";
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import CreateBook from "./create.book";
import DetailBook from "./detail.book";
import UpdateBook from "./update.book";


type TSearch = {
    mainText: string;
    author: string;
    category: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const { message, notification } = App.useApp()
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IBookTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);


    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false)

    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([])

    // const { message, notification } = App.useApp()

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const handleDeleteBook = async (_id: string) => {
        setIsDeleteBook(true)
        const res = await deleteBookApi(_id);
        if (res.data) {
            message.success('Xóa book thành công');
            reFreshTable();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setIsDeleteBook(false)
    }

    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render(__, entity,) {
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
            title: 'Tên Sách',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Thể loại',
            hideInSearch: true,
            dataIndex: 'category',
            sorter: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Giá tiền',
            hideInSearch: true,
            dataIndex: 'price',
            sorter: true,
            renderText(_, entity) {
                return (
                    <>{new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.price)
                    }
                    </>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,

        },
        {
            title: 'Action',
            hideInSearch: true,
            render(_, entity) {
                return (
                    <>
                        <EditTwoTone
                            onClick={() => {
                                setOpenModalUpdate(true)
                                setDataUpdate(entity)
                            }}
                            twoToneColor="#d76d09ff"
                            style={{ cursor: 'pointer', marginRight: "15px" }}
                        />

                        <Popconfirm
                            title="Xác nhận xóa User "
                            description="Bạn chắc chắn xóa user này ?"
                            onConfirm={() => handleDeleteBook(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            placement="leftTop"
                            okButtonProps={{ loading: isDeleteBook }}
                        >
                            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: 'pointer' }} />
                        </Popconfirm>

                    </>
                )
            }

        }

    ];

    const reFreshTable = () => {
        actionRef.current?.reload();
    }


    return (
        <>
            <DetailBook
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
            />
            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                reFreshTable={reFreshTable}
            />

            <UpdateBook
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                reFreshTable={reFreshTable}
            />

            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {

                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                    }

                    //default

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                    }

                    if (sort && sort.author) {
                        query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                    }
                    if (sort && sort.price) {
                        query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                    }


                    const res = await getBookApi(query);
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

                headerTitle="Table book"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-book.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>,


                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    )
}

export default TableBook