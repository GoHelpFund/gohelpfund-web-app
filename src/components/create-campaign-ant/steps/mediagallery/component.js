import React from "react";
import compose from "recompose/compose";
import {Col, Row} from "antd";
import QueueAnim from "rc-queue-anim";
import PicturesWall from "./PicturesWall";
import Step5 from "../images/media.svg";

class MediaGallery extends React.Component {
    constructor(props) {
        super(props);

        /*        if (this.props.location && this.props.location.state && this.props.location.state.referrer) {
            this.state = this.props.location.state.referrer;
            this.getUploadInfo();
        } else {
            this.state = {
                current: 0,
                category: ''
            };
        }*/
    }

    handleFileListChange = (fileList) => {
        this.props.handleFileListChange(fileList);
    };

    handleSelectChange = (selectedItem, status) => {
        this.props.handleProfileImageChange(selectedItem, status);
    };

    render() {
        return (
            <QueueAnim className="demo-content"
                       key="media-gallery"
                       type={['right', 'left']}
                       ease={['easeOutQuart', 'easeInOutQuart']}>
                <div key='media-gallery-step'>
                    <Row type="flex" justify="center">
                        <Col xs={20} md={10} span={13} style={{marginTop: '35px'}}>
                            <h3>Upload images that could give a better understanding of the cause</h3>
                            <br/>
                            <PicturesWall
                            handleFileListChange={this.handleFileListChange}
                            handleSelectChange={this.handleSelectChange}
                            fileList={this.props.fileList}
                            selectedItem={this.props.selectedItem}
                            />
                        </Col>
                        <Col xs={20} md={6} span={9} offset={1}>
                            <img alt='media-gallery-step'
                                 className="step-media-gallery-image"
                                 src={Step5}/>
                        </Col>
                    </Row>
                </div>
            </QueueAnim>
        )
    }
}

export default compose()(MediaGallery);