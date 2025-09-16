import { App, Avatar, Badge, Divider, Drawer, Dropdown, Empty, Popover, Space } from 'antd';
import { useCurrentApp } from 'components/context/app.context';
import { useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { logoutApi } from 'services/api';
import './app.header.scss';
import ManagerAccount from 'components/client/account';
import { isMobile } from 'react-device-detect';

interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void
}

const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openManagerAccount, setOpenManagerAccount] = useState(false);

    const { searchTerm, setSearchTerm } = props;
    const { isAuthenticated, user, setUser, setIsAuthenticated, carts, setCarts } = useCurrentApp();
    const { message } = App.useApp();

    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutApi();
        if (res.data) {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem("carts")
            message.info("Đăng xuất thành công!");
        }

    }

    const items = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManagerAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                    :
                    <Empty
                        description="Không có sản phẩm trong giỏ hàng"
                    />
                }
            </div>
        )
    }
    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <span onClick={() => navigate('/')}> <FaBook className='rotate icon-react' />Book Store</span>

                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                {!isMobile ?
                                    <Popover
                                        className="popover-carts"
                                        placement="bottom"

                                        rootClassName="popover-carts"
                                        title={"Sản phẩm mới thêm"}
                                        content={contentPopover}
                                        arrow={true}>
                                        <Badge
                                            count={carts?.length ?? 0}
                                            size={"small"}
                                            showZero
                                        >
                                            <FiShoppingCart className='icon-cart' />
                                        </Badge>
                                    </Popover>
                                    :
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={"small"}
                                        showZero
                                        onClick={() => navigate('/order')}
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                }
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space >
                                            <Avatar src={urlAvatar} />
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <Link to={'/'} onClick={() => setOpenDrawer(false)}>Trang chủ</Link>
                <Divider />
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setOpenManagerAccount(true)
                        setOpenDrawer(false)
                    }}
                >Quản lý tài khoản
                </label>
                <Divider />
                <p onClick={() => {
                    handleLogout();
                    setOpenDrawer(false);
                }}>Đăng xuất</p>
                <Divider />
            </Drawer>

            <ManagerAccount
                openModal={openManagerAccount}
                setOpenModal={setOpenManagerAccount}
            />
        </>
    )
};

export default AppHeader;
