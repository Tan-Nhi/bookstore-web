import { useCurrentApp } from "@/components/context/app.context";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Breadcrumb, Col, Divider, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import { Link, useNavigate } from "react-router-dom";
import 'styles/book.scss';
import ModalGallery from "./modal.gallery";

interface IProps {
    currentBook: IBookTable | null;
}


type UserAction = "MINUS" | "PLUS"

const BookDetail = (props: IProps) => {
    const { currentBook } = props

    const navigate = useNavigate();
    const { user, setCarts } = useCurrentApp();

    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);

    const { message, notification } = App.useApp();
    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const refGallery = useRef<ImageGallery>(null);

    // const images = [
    //     {
    //         original: "https://picsum.photos/id/1018/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1018/250/150/",
    //         originalClass: 'original-image',
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: "https://picsum.photos/id/1015/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1015/250/150/",
    //         originalClass: 'original-image',
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: "https://picsum.photos/id/1019/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1019/250/150/",
    //         originalClass: 'original-image',
    //         thumbnailClass: "thumbnail-image"
    //     },
    // ];

    useEffect(() => {
        if (currentBook) {
            //build image
            const images = [];
            if (currentBook.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                })
            }
            if (currentBook.slider) {
                currentBook.slider.map(item => {
                    images.push({
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    })
                })
            }
            setImageGallery(images)

        }

    }, [currentBook])

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery.current?.getCurrentIndex() ?? 0)
    }

    const handleChangeButton = (type: UserAction) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0)
                return notification.error({
                    message: "Có Lỗi xảy ra",
                    description: "Số lượng không thể thấp hơn 1"
                })
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === 'PLUS' && currentBook) {
            if (currentQuantity === +currentBook.quantity) return; //max
            setCurrentQuantity(currentQuantity + 1)
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value)
            }
        }
    }

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện tính năng này!");
            return;
        }

        //update localstorage
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];

            //check exits
            let isExistIndex = carts.findIndex(c => c._id === currentBook._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity =
                    carts[isExistIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook?._id,
                    detail: currentBook!
                })
            }
            localStorage.setItem("carts", JSON.stringify(carts));
            setCarts(carts)
        } else {
            //create 
            const data = [{
                _id: currentBook?._id,
                quantity: currentQuantity,
                detail: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))

            //sync React context
            setCarts(data as ICart[]);

        }

        if (isBuyNow) {
            navigate("/order");
        } else {
            message.success("Thêm vào giỏ hàng thành công.")
        }

    }

    return (
        <>
            <div style={{ background: "#efefef", padding: '20px 0' }}>
                <div className="view-detail-book " style={{ maxWidth: 1440, margin: '0 auto', overflow: 'hidden' }}>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: <Link to={"/"} >Trang chủ</Link>
                            },
                            {
                                title: ' Chi tiết sản phẩm'
                            }
                        ]}
                    />
                    <div style={{ padding: '20px', background: "#fff", borderRadius: 5, marginTop: 5 }}>
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false} //hjide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} // left arrow === <></>
                                    renderRightNav={() => <></>} // right arrow === <></>
                                    slideOnThumbnailOver={true} // onHover => auto scroll image
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24} xs={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false}
                                        renderLeftNav={() => <></>} // left arrow === <></>
                                        renderRightNav={() => <></>} // right arrow === <></>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className="author">Tác giả: <a href="#">{currentBook?.author}</a></div>
                                    <div className="title">{currentBook?.mainText}</div>
                                    <div className="rating">
                                        <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                        <span className="sold">
                                            <Divider type="vertical" />
                                            Đã bán {currentBook?.sold ?? 0}
                                        </span>
                                    </div>

                                    <div className="price">
                                        <span className="currency">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency', currency: 'VND',
                                            }).format(currentBook?.price ?? 0)}
                                        </span>
                                    </div>
                                    <div className="delivery">

                                        <span className="left">Vận chuyển</span>
                                        <span className="right">Miễn phí Vận chuyển  </span>


                                    </div>
                                    <div className="quantity">
                                        <span className="left"> Số lượng: </span>
                                        <span className="right">
                                            <button className="decrease" onClick={() => handleChangeButton('MINUS')}> <MinusOutlined /> </button>
                                            <input className="quantity-input" defaultValue={1}
                                                type="text"
                                                value={currentQuantity}
                                                onChange={(e) => handleChangeInput(e.target.value)} />
                                            <button className="increase" onClick={() => handleChangeButton('PLUS')}> <PlusOutlined /> </button>
                                        </span>
                                    </div>

                                    <div className="buy">
                                        <button className="cart" onClick={() => handleAddToCart()}>
                                            <BsCartPlus className="icon-cart" />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button
                                            className="now" onClick={() => {
                                                handleAddToCart(true);
                                            }}>Mua ngay
                                        </button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ''}
            />
        </>
    )
}

export default BookDetail