import { bulkCreateUserApi } from "@/services/api";
import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload, UploadProps } from "antd";
import templateFile from "assets/template/user.xlsx?url";
import { Buffer } from 'buffer';
import Exceljs from "exceljs";
import { useState } from "react";

type TProps = {
    isImportData: boolean
    setIsImportData: (v: boolean) => void
    reFreshTable: () => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}



const ImportData = (props: TProps) => {
    const { isImportData, setIsImportData, reFreshTable } = props

    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message, notification } = App.useApp()
    const { Dragger } = Upload;


    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "",
        customRequest({ onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer as any);

                    // conver file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        //read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;

                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })

                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData)
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload filed.`)
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD

        }))

        const res = await bulkCreateUserApi(dataSubmit);

        if (res.data) {
            notification.success({
                message: "Bulk Create User",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`
            })
        } else {
            notification.error({
                message: "Error",
                description: res.message
            })
        }
        setIsSubmit(false);
        setIsImportData(false);
        setDataImport([]);
        reFreshTable()
    }
    return (
        <>
            <Modal
                title="Import data user"
                width={"50vw"}
                open={isImportData}
                onOk={() => handleImport()}
                onCancel={() => {
                    setIsImportData(false)
                    setDataImport([]);
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Dragger {...propsUpload}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Strictly prohibited from uploading company data or other
                        banned files.
                        &nbsp; <a
                            onClick={(e) => { e.stopPropagation() }}
                            href={templateFile} download >Download Sample File</a>
                    </p>

                </Dragger>

                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>Dữ liệu upload</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: "fullName", title: "Tên hiển thị" },
                            { dataIndex: "email", title: "Email" },
                            { dataIndex: "phone", title: "Số điện thoại" },
                        ]}
                    />
                </div>
            </Modal >

        </>
    )
}

export default ImportData