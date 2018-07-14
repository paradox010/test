import { Col, Row, Select, Button, Icon, Upload, message } from 'antd';
const Option = Select.Option;
const Dragger = Upload.Dragger;

import Card from 'app_component/card';
import {getServerUrl} from 'app_api/commonApi';
import knowledgegraphApi from 'app_api/knowledgegraphApi';

export default class Child extends React.Component{

    constructor(props){
        super(props)

        this.selectLabel = '实例';
        this.url = undefined;
        this.config_id = sessionStorage.getItem('config_id');

        this.state = {
            fileList: []
        }
    }

    async componentDidMount(){
        const {url} = await getServerUrl();
        this.url = url;
    }
    handleCancel = (e) => {
        this.props.isClose(false)
    }
    handelExport = async() => {
        const {entityTreeSlecetValue} = this.props.info;

        window.location.href = this.url + '/supermind/api/knowledgeGraph/exportEntityInstance?config_id=' + this.config_id + '&pid=' + entityTreeSlecetValue;
    }

    downTemplate = () => {
        const {entityTreeSlecetValue} = this.props.info;

        window.location.href = this.url + '/supermind/api/knowledgeGraph/exportEntityTemplate?config_id=' + this.config_id + '&pid=' + entityTreeSlecetValue;
    }

    onFileChange = params => {
        this.file = params.file;
        this.setState(({ fileList }) => ({
            fileList: [...fileList, params.file],
        }));



    }

    handleUpload = async() => {
        this.props.isClose(false);
        let formData = new FormData();
        this.state.fileList.forEach((file) => {
            formData.append('file', file);
        });
        const {entityTreeSlecetValue} = this.props.info;

        // const data = await axios.get(
        //     'http://192.168.1.253:8088/supermind/api/knowledgeGraph/importEntityInstance?config_id=14&pid='+ entityTreeSlecetValue,
        //     {params:{file:formData}}, {
        //       headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //       }
        // });
        // knowledgegraphApi.importEntityInstance({pid:entityTreeSlecetValue,formData}).then(res=>{
        //
        // })
    }
    render(){

        return (
            <Card
        title='导入导出'
        body={
        <Row gutter={16} >
            <Col  offset={2}>
                <div>
                    <Select defaultValue="instance" style={{ width: 270 }}>
                        <Option value="instance">实例</Option>
                        <Option value="concept" disabled>概念</Option>
                        <Option value="prop" disabled>属性</Option>
                    </Select>
                    {/*<br />*/}
                    {/*<Button style={{marginTop:20}} type="primary" onClick={this.handelExport}>{`${this.selectLabel}导出`}</Button>*/}
                    {/*<br />*/}
                    <Button style={{margin:'20px 0',}} type="primary" onClick={this.downTemplate}>{`下载${this.selectLabel}模板`}</Button>
                    {/*<br />*/}
                    <div style={{
                        width: '90%',
                        height:'195px'
                    }}>
                        <Dragger
                            customRequest={this.onFileChange}
                            fileList={this.state.fileList}
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            {/*<p className="ant-upload-text">{`上传${this.selectLabel}`}</p>*/}
                            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                        </Dragger>
                    </div>
                    <div style={{width:"90%",textAlign:'right'}}>
                        <Button style={{marginTop:48,marginRight:'20px'}} onClick={this.handleCancel}>取消</Button>
                        <Button style={{marginTop:48}} type="primary" onClick={this.handleUpload}>确定</Button>
                    </div>

                </div>
            </Col>
        </Row>

    }
        />

        )
    }
}
