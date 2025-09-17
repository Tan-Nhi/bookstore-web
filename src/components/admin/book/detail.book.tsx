import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Divider, Drawer, GetProp, Image, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type TProps = {
    isDetailOpen: boolean;
    dataDetail: IBookTable | null
    setIsDetailOpen: (v: boolean) => void;
    setDataDetail: (v: IBookTable | null) => void;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const TableDetail = (props: TProps) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail } = props

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });



    useEffect(() => {
        if (dataDetail) {
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
            if (dataDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetail.thumbnail}`
                }
            }
            if (dataDetail.slider && dataDetail.slider.length > 0) {
                dataDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }

    }, [dataDetail])

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);
    return (
        <>
            <Drawer
                title="Chi tiết book"
                closable={{ 'aria-label': 'Close Button' }}
                width={"50vw"}
                onClose={() => {
                    setDataDetail(null);
                    setIsDetailOpen(false)
                }}
                open={isDetailOpen}
            >
                <Descriptions
                    title="Thông tin Book"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency', currency: 'VND',
                        }).format(dataDetail?.price ?? 0)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataDetail?.category} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At" labelStyle={{ minWidth: 120 }}>

                        {dayjs(dataDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At" labelStyle={{ minWidth: 120 }}>
                        {dayjs(dataDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left"> Ảnh Books </Divider>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer >
        </>
    )
}
export default TableDetail