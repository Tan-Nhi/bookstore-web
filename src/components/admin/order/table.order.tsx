import { getOrderApi } from "@/services/api";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { useState } from "react";

type TSearch = {
    _id: string;
    name: string;
    address: string;
    TotalPrice: number;
    createdAt: string;

}

const TableOrder = () => {
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render(_, entity,) {
                return (
                    <a href='#'
                        onClick={() => {
                            // setDataDetail(entity);
                            // setIsDetailOpen(true);
                        }}> {entity._id}  </a>
                )
            },

        },
        {
            title: 'Full Name',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true
        },
        {
            title: 'Giá tiền',
            hideInSearch: true,
            dataIndex: 'totalPrice',
            sorter: true,
            renderText(_, entity) {
                return (
                    <>{new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.totalPrice)
                    }
                    </>
                )
            }
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,

        },

    ];
    return (
        <>
            <ProTable<IOrderTable, TSearch>
                columns={columns}
                // actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {

                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.name) {
                            query += `&name=/${params.name}/i`
                        }
                        if (params.address) {
                            query += `&address=/${params.address}/i`
                        }
                    }

                    //default
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;

                    const res = await getOrderApi(query);
                    if (res.data) {
                        setMeta(res.data.meta)

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

                headerTitle="Table Order"

            />
        </>
    )
}

export default TableOrder