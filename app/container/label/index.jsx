import {Layout,Icon,Popover,Form,Tag,List,Divider,Tooltip} from 'antd';
const FormItem = Form.Item;
const {Header} = Layout;
import "./label.css"
import PageContainer from 'app_component/pagecontainer';
import Eventlist from "./eventlist";
import FormEvent from "./formevent";
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from "actions/labelaction";
import {Link} from 'react-router-dom';


const mapStateToProps = state => {
    return {label: state.get('label').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends React.Component{
    constructor(args){
        super(args);
        this.state={
            visible:false,
            visibleList:false,
            selectText:"",
            selectListKey:false,
            selectInputKeys:null,
            selectInputId:null,
            addStatus: false
        }
    }
    getText=()=>{
        //获取选中文字
        this.setState({
            selectText:window.getSelection().toString()
        })
    }
    componentDidMount() {
        const urlData = this.props.match.params.search.split("&");
        if(urlData.length>3){
            this.setState({
                selectListKey:urlData[3],
                selectInputKeys:urlData[4],
                selectInputId:urlData[5],
                selectText:urlData[6],
            })
        }
        this.props.label.eventTemplateId=urlData[0];
        this.props.actions.getEventList({
            eventTemplateId:urlData[0],
            resourceId:urlData[1]
        })
        this.props.actions.getMoreDoc({
            resourceId:urlData[1],
            docType:decodeURI(urlData[2])//解析中文
            // docType:"财通文档测试v5"//测试使用
        })
    }
    hide = () => {
        this.setState({
            visible: false,
        });
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });          
    };
    handlePopoverVisible=(args)=>{
        this.setState({
            visible: args
        });
    };
    //获取左侧选中值
    getInputFocusIndex=(index)=>{
        if(index===""){
            document.getElementById("htmlContent").scrollTop=0;
        }else{
            let target = document.querySelector("lz[data-tab=" + index+ "]" );
            target.style.background="gray";
            target.scrollIntoView(false);
        }
    };
    //更新列表
    updateEvent=(res)=>{
        const urlData = this.props.match.params.search.split("&");
        res.eventTemplateId=this.props.label.eventTemplateId;
        this.props.actions.updateEvent(res)        
        
        this.props.actions.getEventList({
            eventTemplateId:urlData[0],
            resourceId:urlData[1]
        })

    };
    deleteEvent=(res)=>{
        this.props.actions.deleteEvent({eventId:res});
    };
    //更多文档列表点击
    openNewDoc=(eventTemplateId,resourceId)=>{

        const urlData = this.props.match.params.search.split("&");
        this.props.label.eventTemplateId=urlData[0];
        this.props.actions.getEventList({
            eventTemplateId:eventTemplateId,
            resourceId:resourceId
        })
        this.props.actions.getMoreDoc({
            resourceId:resourceId,
            docType:decodeURI(urlData[2])//解析中文
            // docType:"财通文档测试v5"//测试使用
        })
        this.setState({
            visibleList: false,
        });
    };
    handleVisibleChangeList = (visibleList) => {
        this.setState({ visibleList});
    };
    openPdf=(url)=>{
        window.open(url);
    };
    getSelectKey=(res)=>{
        this.setState({
            selectListKey:res
        })
    };
    changeItemList=(res)=>{
        console.log(res)
    }
    render(){
        const {getMoreDocs,next,last,eventList,menuDataList,tabMapList,menuList} = this.props.label;
        const menuDataLists = JSON.parse(menuDataList);
        const tabMapLists = JSON.parse(tabMapList);
        const {selectListKey,selectInputKeys,selectInputId,selectText} = this.state;

        

        const content=(
            <div>
                <div>
                    <FormEvent isClose={res=>{
                        this.handlePopoverVisible(res)
                    }}/>
                </div>
            </div>
        );

        const listContent=(
            <List
                className="docsList"
                dataSource={getMoreDocs.documentList}
                split={false}
                renderItem={item => (<List.Item  onClick={(templateId,resourceId)=>this.openNewDoc(item.eventTemplateId,item.resourceId)}>{item.documentName}</List.Item>)}
            />
        )
        return(
            <div style={{height:"100%",overflow:"hidden"}}>
                <Header>
                    <div className="baselayout-logo"></div>
                </Header>
                <PageContainer
                    areaLeft={
                        <div style={{height:"100%"}}>
                            <p className="eventListTitle">
                                <span>事件列表</span>
                                <Popover overlayStyle={{width:"360px"}}
                                         visible={this.state.visible}
                                         onVisibleChange={this.handleVisibleChange}
                                         placement="bottomRight"
                                         title="新建事件"
                                         content={content}
                                         trigger="click">
                                    <Icon type="plus" />
                                </Popover>

                            </p>

                            <Eventlist {...this.state} menuData={menuList}  
                                    selectInputId={selectInputId} 
                                    selectInputKeys={selectInputKeys} 
                                    selectKey={selectListKey} 
                                    inputText={selectText}
                                    dataTabList={tabMapLists} 
                                    eventDetailData={menuDataLists}
                                    getIndex={res=>{this.getInputFocusIndex(res)}}
                                    update={res=>{this.updateEvent(res)}}
                                    deleteEvent={res=>{this.deleteEvent(res)}}
                                    getSelectKey={res=>{this.getSelectKey(res)}}
                            />

                        </div>
                    }
                    areaRight={
                        <div style={{padding:"0 32px",height:"100%"}}>
                            <p className="labelTitle">文档详情</p>
                            <div>
                                <span className="textTitle">{eventList.documentName}</span>
                                {
                                    eventList.url===""?<span className="pdfNoneExit"><Icon type="file-pdf" /><Divider type="vertical" /><span>pdf</span></span>:
                                        <Tooltip placement="bottom" title="查看PDF原文">
                                            <span className="pdfNoneExit pdfExit" onClick={(url)=>this.openPdf(eventList.url)}><Icon type="file-pdf" /><Divider type="vertical" /><span>pdf</span></span>
                                        </Tooltip>

                                }
                            </div>
                            <div style={{marginBottom:"32px"}}>
                            <span>发布时间：{eventList.publishTime}</span><Divider type="vertical" /><span>标注进度：<span style={{color:"#1890FF"}}>{eventList.completion}</span></span>
                            </div>
                            <div id="htmlContent" dangerouslySetInnerHTML={{__html:eventList.content}} onClick={this.getText} style={{height:"47%",overflowY:"auto"}}>

                            </div>
                            <div style={{textAlign:"center",marginTop:"30px"}}>
                                <Popover
                                    placement="top"
                                    overlayStyle={{width:"580px",maxHeight:"515px",overflowY:"auto"}}
                                    title="文档列表"
                                    trigger="click"
                                    content={listContent}
                                    visible={this.state.visibleList}
                                    onVisibleChange={this.handleVisibleChangeList}
                                >
                                    <Tag color="#2db7f5" className="tagStyle">
                                        <Icon type="file-text" />
                                        <br/>
                                        更多文档
                                    </Tag>
                                </Popover>

                                <div style={{display:"inline-block",textAlign:"left"}}>
                                    {
                                        JSON.stringify(last) === "{}"?<div style={{color:"rgba(0,0,0,0.25)",fontSize:"16px"}}>上一篇：已经是第一篇</div>:
                                        <div className="prevText"  onClick={(templateId,resourceId)=>this.openNewDoc(last.eventTemplateId,last.resourceId)}>上一篇：{last.documentName}</div>
                                    }
                                    {
                                        JSON.stringify(next) === "{}"?<div style={{color:"rgba(0,0,0,0.25)",fontSize:"16px"}}>下一篇：已经是最后一篇</div>:
                                            <div className="prevText" onClick={(templateId,resourceId)=>this.openNewDoc(next.eventTemplateId,next.resourceId)}>下一篇：{next.documentName}</div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>
        )
    }
}
