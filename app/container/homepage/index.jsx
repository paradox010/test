import React,{Componnent} from "react";
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from "actions/homepage";
import { List, Card,Divider,Icon,Modal,Form, Input, Button, Radio,Col,Row,message,Avatar,Popover,Tooltip } from 'antd';
const { Meta } = Card;
import "./index.css";
const FormItem = Form.Item;
const confirm = Modal.confirm;
const mapStateToProps = state => {
    return {homepage: state.get('homepage').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends React.Component{
    constructor(arg){
        super(arg);
        this.state = {
            visible: false ,
            visibleEdit:false,
            domain:"",
            domainName:"",
            domainDescription:"",
            infoList:"",
            createStatue:false,
            formStatus:"",
            disableStatus:null,
        };
    }
    handleVisibleChange = (popoverVisible,index) => {
        this.setState({ ["popoverVisible"+index]:true });
    }
    showModal = (event,data,type,status,index) => {
        event.stopPropagation();
        this.setState({
            visible: true,
            domain:data===true?"":data.domain,
            domainName:data===true?"":data.domainName,
            domainDescription:data===true?"":data.domainDescription,
            infoList:data,
            createStatue:data===true?true:false,
            editType:type,
            formStatus:status,
            disableStatus:status==="look"?true:false,
            ["popoverVisible"+index]:false
        });
    };
    deleteItem=(e,index,data)=>{
        e.stopPropagation();
        const _this = this;
        confirm({
            title: '确认要删除这个项目吗？',
            content: '须知：该项目删除后不可恢复，请仔细确认后再进行操作。',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            className:"deleteModal",
            onOk() {
                _this.props.actions.deleteItem({
                    id:data.id
                });
                message.success("删除成功");
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
        this.setState({
            ["popoverVisible"+index]:false
        });

    };
    handleOk = (e) => {
        this.setState({
            visible: false,
            visibleEdit:false
        });
        const dataList={
            domain:this.state.domain,
            domainName:this.state.domainName,
            domainDescription:this.state.domainDescription
        };
        if(this.state.createStatue===true){
            this.props.actions.addHomePageList(dataList);
            message.success("添加成功");
        }else{
            dataList.id = this.state.infoList.id;
            this.props.actions.editHomePageList(dataList);
            for(let key in this.state.infoList){
                if(key==="domain")
                    this.state.infoList[key]=this.state.domain
                else if(key==="domainName")
                    this.state.infoList[key]=this.state.domainName
                else if(key==="domainDescription")
                    this.state.infoList[key]=this.state.domainDescription

            }
            message.success("修改成功");
        }
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
            visibleEdit:false
        });
    };
    handleChange=(e)=>{
      this.setState({
          [e.target.name]:e.target.value
      })
    };
    componentDidMount(){
        this.props.actions.gethomepagelist();
    }

    hanldeSelectDomain = (id) => {
        //将conf_id 存在sessionStorage中
        //页面不关闭id将一直存在，在commonApi统一拦截
        //切换回domain时再次更改
        sessionStorage.setItem('config_id', id);
        // conf.CONF_ID = id;
        this.props.history.push('/supermind');
    };
    noTurn=(e)=>{
        e.stopPropagation();
    };
    changeInputStatus=()=>{
        this.setState({
            disableStatus:false,
            formStatus:"edit"
        })
    };
    render(){
        return(
            <div id="homePageList">
                <p className="itemListTitle">项目列表</p>
                <Row gutter={16}>
                {this.props.homepage.infoList.map((item,index)=>{
                    return  <Col xs={24} sm={24} md={12} lg={6} span={6} key={index}>
                            <Card style={{height:"300px"}}
                                  className="cardList"
                                  extra={<Popover placement="bottom"
                                                  content={(
                                                      <div className="listEdit">
                                                          <span style={{cursor:"pointer"}} onClick={(e,data,status,indexs)=>this.showModal(e,item.configItem,false,"look",index)}>查看详情</span>
                                                          <Divider/>
                                                          <span style={{cursor:"pointer"}} onClick={(e,data,status,indexs)=>this.showModal(e,item.configItem,true,"edit",index)}>修改详情</span>
                                                          <Divider/>
                                                          <span style={{cursor:"pointer"}}onClick={(e,indexs,data)=>this.deleteItem(e,index,item.configItem)}>删除项目</span>
                                                      </div>
                                                  )}
                                                  onVisibleChange={(popoverVisible,indexs)=>this.handleVisibleChange(popoverVisible,index)}
                                                  visible={this.state["popoverVisible"+index]}
                                                  trigger="click">
                                      <span className="openEditList" onClick={(e)=>this.noTurn(e)}> . . . </span>
                                  </Popover>}
                                  avatar={<Avatar size="small" icon="folder"style={{ backgroundColor: '#fff',color:"black" }} />}
                                  title={
                                      <Tooltip placement="bottom" title="点击进入项目">
                                          <div><Icon type="folder" /><span style={{marginLeft:"8px",fontWeight:"bold"}}>{item.configItem.domainName}</span></div>
                                      </Tooltip>

                                  }
                                  key={index}
                                  onClick={()=>{this.hanldeSelectDomain(item.configItem.id)}}
                            >
                                <Tooltip placement="bottom" title="点击进入项目">
                                    <Meta
                                        description={<div style={{color:"rgba(0,0,0,0.45)"}}>描述：{item.configItem.domainDescription}</div> }
                                    />
                                </Tooltip>

                                <Tooltip placement="bottom" title="点击进入项目">
                                    <p className="statistics" >统计信息</p>
                                </Tooltip>

                                <ul className="listInfo">
                                    <li className="eventListTable">
                                        <Tooltip placement="bottom" title="点击进入项目">
                                            <Row>
                                                <Col span={8}>
                                                    <span style={{color:"rgba(0,0,0,0.45)"}}>名称</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>总数(个)</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span style={{color:"rgba(0,0,0,0.45)"}}>本周新增(个)</span>
                                                </Col>
                                            </Row>
                                        </Tooltip>

                                    </li>
                                    <li>
                                        <Tooltip placement="bottom" title="点击进入项目">
                                            <Row>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>实体数量</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.entityTotal}</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.weekEntityTotal}</span>
                                                </Col>
                                            </Row>
                                        </Tooltip>
                                    </li>
                                    <li>
                                        <Tooltip placement="bottom" title="点击进入项目">
                                            <Row>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>事件数量</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.eventTotal}</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.weekEventTotal}</span>
                                                </Col>
                                            </Row>
                                        </Tooltip>
                                    </li>
                                    <li>
                                        <Tooltip placement="bottom" title="点击进入项目">
                                            <Row>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>文档数量</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.docTotal}</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.weekDocTotal}</span>
                                                </Col>
                                            </Row>
                                        </Tooltip>
                                    </li>
                                    <li>
                                        <Tooltip placement="bottom" title="点击进入项目">
                                            <Row>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>关系数量</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span  style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.relationTotal}</span>
                                                </Col>
                                                <Col span={8}>
                                                    <span style={{color:"rgba(0,0,0,0.45)"}}>{item.totalItem.weekRelationTotal}</span>
                                                </Col>
                                            </Row>
                                        </Tooltip>
                                    </li>
                                </ul>
                            </Card>
                        </Col>
                })}
                    <Col xs={24} sm={24} md={12} lg={6} span={6} onClick={(e,status,statuss)=>this.showModal(e,true,true,"new")}>
                        <Card className="addNewCard">
                            <Icon type="plus" className="iconPlus"/>
                            <span style={{display:"block"}}>点击添加新区域</span>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title={this.state.formStatus==="new"?"新建项目":this.state.formStatus==="look"?"查看项目":"修改项目"}
                    width="580px"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        this.state.formStatus==="look"?<Button key="submits" type="primary" onClick={this.changeInputStatus}>
                                修改详情
                            </Button>:<Button key="submits"  onClick={this.handleCancel}>取消 </Button>,

                        this.state.formStatus!=="look"?<Button key="submit" type="primary" onClick={this.handleOk}> 保存</Button>:"",
                    ]}
                    className="formList"
                    wrapClassName="vertical-center-modal"
                >
                    <Form layout="inline">
                        <FormItem
                            label="项目名称"
                            className={this.state.editType?"ant-col-24 inputWidth":"ant-col-24"}
                        >
                             <Input style={{width:"272px"}} type="text" disabled={this.state.disableStatus} value={this.state.domainName} name="domainName" onChange={this.handleChange}/>

                        </FormItem>
                        <FormItem
                            label="英文名称"
                            className={this.state.editType?"ant-col-24 inputWidth":"ant-col-24"}
                        >
                            <Input style={{width:"272px"}} disabled={this.state.disableStatus} type="text" value={this.state.domain} name="domain" onChange={this.handleChange} />

                        </FormItem>
                        <FormItem
                            label="项目描述"
                            className={this.state.editType?"ant-col-24 inputWidth":"ant-col-24"}
                        >
                           <Input style={{width:"272px"}} disabled={this.state.disableStatus} type="text" value={this.state.domainDescription} name="domainDescription" onChange={this.handleChange} />

                        </FormItem>
                    </Form>

                </Modal>
            </div>
        )
    }
}
