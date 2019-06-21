import React from "react";
import compose from "recompose/compose";

import {Icon, message, Modal, Select, Typography, Upload} from 'antd';

const {Text} = Typography;
const {Option} = Select;
const Dragger = Upload.Dragger;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: this.props.fileList,
        selectedItem: this.props.selectedItem
    };

    handleCancel = () => {
        console.log('handleCancel');
        this.setState({previewVisible: false});
    }

    handleRemove = file => {
        console.log('handleRemove');

        const index = this.state.fileList.indexOf(file);
        const newFileList = this.state.fileList.slice();
        newFileList.splice(index, 1);

        if (this.state.selectedItem === file.uid) {
            const newSelectedItem = newFileList.length === 0 ? undefined : newFileList[0].uid;
            this.setState({
                fileList: newFileList,
                selectedItem: newSelectedItem
            });
            this.props.handleSelectChange(newSelectedItem);
        } else {
            this.setState({
                fileList: newFileList,
            });
        }

        this.props.handleFileListChange(newFileList);
    };

    handlePreview = async file => {
        console.log('handlePreview');
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = info => {
        console.log('handleChange');
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show six recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-5);

        this.setState({fileList});
        this.props.handleFileListChange(fileList);
    };

    beforeUpload = (file, FileList) => {

        console.log('beforeUpload');
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        if (!isJPG && !isPNG) {
            message.error('File format allowed: .jpeg .png');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5 MB');
        }

        const isFull = this.state.fileList.length === 5;
        if (isFull) {
            message.error('Limit of 5 images reached');
            message.info('Remove existing images in order to upload new ones')
        }

        const isOverflow = this.state.fileList.length + FileList.length > 5;
        if (isOverflow && !isFull) {
            message.error('Total number of images exceeds 5');
            message.info('Please select fewer images')
        }

        return new Promise((resolve, reject) => {
            if ((isJPG || isPNG) && isLt5M && !isFull && !isOverflow) {
                resolve(file);
            } else {
                reject(file);
            }
        })
    };

    handleSelectChange = selectedItem => {
        console.log('select: ' + selectedItem);
        this.setState({selectedItem});
        this.props.handleSelectChange(selectedItem);
    };

    render() {
        const {previewVisible, previewImage, fileList, selectedItem} = this.state;
        const props = {
            action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
            name: 'file',
            multiple: true,
            type: 'drag',
            listType: "picture-card",
            fileList,
            onChange: this.handleChange,
            onPreview: this.handlePreview,
            onRemove: this.handleRemove,
            beforeUpload: this.beforeUpload,
            showUploadList: {
                showPreviewIcon: true,
                showRemoveIcon: true
            },
        };

        return (
            <div className="clearfix">
                <Select
                    placeholder="Select the campaign profile image."
                    mode="default"
                    onChange={this.handleSelectChange}
                    value={selectedItem}
                    style={{width: '100%', marginBottom: '20px'}}
                >
                    {fileList.map((item, index) => (
                        <Option value={item.uid} key={item.uid}><Text code>{index + 1}</Text> {item.name}</Option>
                    ))}
                </Select>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="cloud-upload"/>
                    </p>
                    <p className="ant-upload-text">Click or drag images to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload and up to 5 images.
                    </p>
                </Dragger>
                <Modal centered visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

export default compose()(PicturesWall);

