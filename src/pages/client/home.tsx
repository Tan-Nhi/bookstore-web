import MobileFilter from "@/components/client/book/mobile.filter";
import { getBookApi, getCategoryAPI } from "@/services/api";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Spin, Tabs } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/home.scss"

type FieldType = {
    range: {
        from: number;
        to: number;
    }
    category: string[]

}

const HomePage = () => {

    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false)
    const [listCategory, setListCategory] = useState<{ label: string, value: string }[]>([]);

    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

    const [form] = Form.useForm();
    const navigate = useNavigate();
    useEffect(() => {
        const initCatelogry = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        initCatelogry()
    }, [])

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);


    const fetchBook = async () => {
        setIsLoading(true)

        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await getBookApi(query);

        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total)
        }

        setIsLoading(false)

    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`)
            } else {
                setFilter('');
            }
        }

    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values?.range?.from >= 0 && values?.range.to >= 0) {
            let f = `price>=${values.range.from}&price<=${values.range.to}`;
            if (values.category.length) {
                const cate = values.category.join(',');
                f += `&category=${cate}`
            }
            setFilter(f)
        }
    }

    const items = [
        {
            key: 'sort=-sold',
            label: `Phổ biến`,
            children: <></>
        },
        {
            key: 'sort=-updatedAt',
            label: `Hàng mới`,
            children: <></>
        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>
        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>
        },
    ]



    return (
        <>
            <div style={{ background: '#efefef', padding: '20px 0' }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                    <Row gutter={[20, 20]} >
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: '20px', background: "#fff", borderRadius: "5px" }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: 500 }} > <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                                    <ReloadOutlined title="Reset" onClick={() => {
                                        form.resetFields();
                                        setFilter('')
                                    }} />
                                </div>
                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                                >

                                    <Form.Item
                                        name="category"
                                        label="Danh mục sản phẩm "
                                        labelCol={{ span: 24 }}
                                    >

                                        <Checkbox.Group>
                                            <Row>
                                                {listCategory?.map((item, index) => {
                                                    return (
                                                        <Col span={24} key={`index-${index}`} style={{ padding: '7px' }}>
                                                            <Checkbox value={item.value}>
                                                                {item.label}
                                                            </Checkbox>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </Checkbox.Group>

                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Khoảng giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                            <Form.Item
                                                name={["range", "from"]}>
                                                <InputNumber
                                                    name="from"
                                                    min={0}
                                                    placeholder="Đ Từ"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                />
                                            </Form.Item>
                                            <span>-</span>
                                            <Form.Item
                                                name={["range", "to"]}>
                                                <InputNumber
                                                    name="to"
                                                    min={0}
                                                    placeholder="Đ Đến"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}


                                                />
                                            </Form.Item>
                                        </div>
                                        <div >
                                            <Button onClick={() => form.submit()} style={{ width: '100%' }} type="primary">Áp dụng</Button>
                                        </div>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        label="Đánh giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        <div>
                                            <Rate value={5} disabled style={{ color: '#ffce3d' }} />
                                            <span className="ant-rate-text"></span>
                                        </div>
                                        <div>
                                            <Rate value={4} disabled style={{ color: '#ffce3d' }} />
                                            <span className="ant-rate-text"> Trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={3} disabled style={{ color: '#ffce3d' }} />
                                            <span className="ant-rate-text"> Trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={2} disabled style={{ color: '#ffce3d' }} />
                                            <span className="ant-rate-text"> Trở lên</span>
                                        </div>
                                        <div>
                                            <Rate value={1} disabled style={{ color: '#ffce3d' }} />
                                            <span className="ant-rate-text"> Trở lên</span>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>

                        <Col md={20} sm={24} >
                            <Spin spinning={isLoading} tip="Loading..." >
                                <div style={{ padding: '20px', background: "#fff", borderRadius: "5px" }}>
                                    < Row>
                                        <Tabs defaultActiveKey="sort=-sold"
                                            items={items}
                                            onChange={(value) => { setSortQuery(value) }}
                                            style={{ overflow: "auto" }}
                                        />
                                        <Col xs={24} md={0}>
                                            <div style={{ marginBottom: 20 }}>
                                                <span onClick={() => setShowMobileFilter(true)}>
                                                    <FilterTwoTone />
                                                    <span style={{ fontWeight: 500 }}>Lọc</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="customize-row">

                                        {listBook?.map((item, index) => {
                                            return (
                                                <>

                                                    <div className="customize-row__column"
                                                        onClick={() => navigate(`/book/${item._id}`)}
                                                        key={`book-${index}`}>
                                                        <div className="customize-row__wrapper">
                                                            <div className="customize-row__thumbnail">
                                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail" />
                                                            </div>
                                                            <div className="customize-row__text" title={item.mainText}>{item.mainText} </div>
                                                            <div className="customize-row__price">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency', currency: 'VND',
                                                                }).format(item.price)}

                                                            </div>
                                                            <div className="customize-row__rating">

                                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                                <span>Đã bán {item.sold ?? 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </>
                                            )
                                        })}

                                    </Row>
                                    <Divider />
                                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Pagination
                                            current={current}
                                            total={total}
                                            pageSize={pageSize}
                                            responsive
                                            onChange={(p, s) => { handleOnchangePage({ current: p, pageSize: s }) }}
                                        />
                                    </Row>
                                </div>
                            </Spin>
                        </Col>
                    </Row>
                </div >
            </div>
            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                handleChangeFilter={handleChangeFilter}
                listCategory={listCategory}
                onFinish={onFinish}
            />
        </>
    )
}

export default HomePage
