import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void
    currentIndex: number
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]
    title: string;
}

const ModalGallery = (props: IProps) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex])


    return (
        <>
            <Modal
                width={'80vw'}
                centered
                open={isOpen}
                onOk={() => { }}
                onCancel={() => {
                    setIsOpen(false)
                }}
                footer={null}
                closable={false}
                className="modal-gallery"


            >
                <Row gutter={[20, 20]} >
                    <Col span={18} xs={4} md={0}>
                        <ImageGallery
                            ref={refGallery}
                            items={items}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            startIndex={currentIndex}
                            showThumbnails={false}
                            onSlide={(i) => setActiveIndex(i)}
                            slideDuration={0}
                        />

                    </Col>

                    <Col span={6} xs={20} md={24} >
                        <div style={{ padding: '5px 0 20px 0', fontWeight: 500, textAlign: 'center' }}>{title}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '5px 0 20px 0', fontWeight: 500, textAlign: 'center' }}>
                            {
                                items.map((item, i) => {
                                    return (
                                        <Col key={`image-${i}`}>
                                            <Image
                                                wrapperClassName={"img-normal"}
                                                width={100}
                                                height={100}
                                                src={item.original}
                                                preview={false}
                                                onClick={() => {
                                                    refGallery.current?.slideToIndex(i);
                                                }}
                                            />
                                            <div className={activeIndex === i ? "active" : ""}></div>
                                        </Col>
                                    )
                                })
                            }

                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    )

}

export default ModalGallery