import { Button, Result } from "antd";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError() as { statusText?: string; message?: string };

    console.error(error);

    return (
        <Result
            status="404"
            title="Không tìm thấy trang!"
            subTitle={<i>{error.statusText ?? error.message}</i>}
            extra={
                <Button type="primary">
                    <Link to="/">
                        <span>Trờ về trang chủ</span>
                    </Link>
                </Button>
            }
        />
    );
}
