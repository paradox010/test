
import { Table, message, Button ,Select,Slider,Popover,Icon,Input,Tabs,List,Popconfirm,Tooltip } from "antd";
const Option = Select.Option;
const Search = Input.Search;
const TabPane = Tabs.TabPane;

import PageContainer from 'app_component/pagecontainer';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from "actions/artificialcorrection";
import WrapTree from 'app_component/tree';
import "./index.css";
import WrapTabs from 'app_component/tabs';

const marks = {
    0: '0',
    10: '',
    20: '20%',
    30: '',
    40: '40%',
    50: '',
    60: '60%',
    70: '',
    80: '80%',
    90: '',
    100: '100%',
};
const TAB_LIST = [
    {
        name: '数据校验',
        key: 'dataCheck'
    }, 
    {
        name: '图谱审查',
        key: 'atlasReview'
    }
];
const mapStateToProps = state => {
    return {artificialcorrection: state.get('artificialcorrection').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
@connect(mapStateToProps, mapDispatchToProps)
export default class ArtificialCorrection extends React.Component{
    constructor(args){
        super(args);
        this.state={
            filteredInfo: null,
            sortedInfo: null,
            progressStart:"50.00",
            progressEnd:"100.00",
            content:[],
            tabList:[],
            annotateperson:"",
            searchValue:"",
            isAdd: false        
        };
    }
    componentDidMount=()=>{
        this.props.actions.getDocConceptList({id:"0"});
    }
    //滑动条离开鼠标
    onAfterChange=(value)=> {
        const {artificialcorrection:{noticeTitle}} = this.props;
        this.setState({
            progressStart:value[0].toFixed(2),
            progressEnd:value[1].toFixed(2)
        });
        this.props.actions.getTableContent({
            page:1,
            pageSize:6,
            completionFrom:value[0].toFixed(2),
            completionTo:value[1].toFixed(2),
            docType:noticeTitle,
            searchKeyword:this.state.searchValue,
            annotate:this.state.annotateperson
        })
    };
    callback=(key)=> {
    };
    setAgeSort = (value) => {
        const {artificialcorrection:{noticeTitle}} = this.props;
        let annotateperson="";
        if(value==="all")
            annotateperson=""
        else if(value==="person")
            annotateperson="人工标引"
        else
            annotateperson="机器标引"
        this.setState({
            annotateperson:annotateperson
        })
        this.props.actions.getTableContent({
            page:1,
            pageSize:6,
            annotate:annotateperson,
            docType:noticeTitle,
            searchKeyword:this.state.searchValue,
            completionFrom:this.state.progressStart,
            completionTo:this.state.progressEnd
        })
    };
    search=(value)=>{
        const {artificialcorrection:{noticeTitle}} = this.props;
        this.setState({
            searchValue:value
        })
        this.props.actions.getTableContent({
            page:1,
            pageSize:6,
            searchKeyword:value,
            docType:noticeTitle,
            completionFrom:this.state.progressStart,
            completionTo:this.state.progressEnd,
            annotate:this.state.annotateperson
        })

    };
    //点击查看事件
    seeEventList=(e,record)=>{
        e.stopPropagation();
        let evenListArr = []
        for(let i =0;i<record.eventList.length;i++){
            evenListArr[i]=[]
            for(let key in record.eventList[i]){
                if(key!=="eventId"&&key!=="tabMap"&&key!=="事件名称")
                    evenListArr[i].push(key+":"+record.eventList[i][key])
            }
        }
        this.setState({
            content:(
                    <Tabs onChange={this.callback} type="card">
                        {
                            record.eventList.map((items,indexs)=>(
                                // tab={items.事件名称}
                                // console.log(items.事件名称)
                                <TabPane tab={items.事件名称.length>8?
                                    <Tooltip placement="top" title={items.事件名称}>
                                        {items.事件名称.substring(0,4)+"..."+items.事件名称.substring(items.事件名称.length-2)}

                                    </Tooltip>
                                    :items.事件名称} key={indexs}>
                                    <List

                                        bordered
                                        style={{height:"253px",overflowY:"scroll"}}
                                        dataSource={evenListArr[indexs]}
                                        renderItem={(item ,index)=> (
                                            <List.Item actions={[
                                                <Tooltip placement="top" title="转到事件属性编辑">
                                                    <a href={"#/label/"+record.eventTemplateId+"&"+record.resourceId+"&"+this.props.artificialcorrection.noticeTitle+"&"+indexs+"事件名称eventList"+"&"+indexs+item.split(':')[0]+"eventDataList&"+index+"_"+indexs+"&"+indexs+item.split(':')[1]} target="_blank">
                                                        <Icon type="edit"  />
                                                    </a>
                                                </Tooltip>

                                            ]} key={index}>
                                                <div>{item}</div>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>

                            )
                            )
                        }

                    </Tabs>
            )
        })
    };
    //选择左侧树选项
    entityTreeOnSelect = (selectKey, e) => {     
        if (selectKey.length) {
            this.props.actions.changeEntityTreeSelect({selectKey, selectValue: e.node.props.nodeValue,selectName:e.node.props.dataRef.title, selectIdPath: e.node.props.idPath})
        }
    };
    //分页函数
    pageChange=(page,pageSize)=>{
        this.props.actions.getTableContent({
            docType:this.props.artificialcorrection.noticeTitle,
            page:page,
            pageSize:pageSize,
            searchKeyword:this.state.searchValue,
            completionFrom:this.state.progressStart,
            completionTo:this.state.progressEnd,
            annotate:this.state.annotateperson
        })
    }

    render(){
        const {artificialcorrection:{conceptList,entityTreeSelectInfo,getTableContent,noticeTitle,totalPage}} = this.props;
        const text = <span>请选择完成度范围</span>;
        const content = (
            <Slider range step={10} marks={marks} defaultValue={[50, 100]} onChange={this.onChange} onAfterChange={this.onAfterChange} />
        );
        let {  filteredInfo } = this.state;
        filteredInfo = filteredInfo || {};
        this.columns = [{
            title: '公告名称',
            dataIndex: 'name',
            key: 'name',
            width:"300px",
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) =>record.name.props.title.includes(value)
        }, {
            title: '发布时间',
            dataIndex: 'datetime',
            key: 'datetime',
            width:"12%"
        }, {
            title: '标注者',
            dataIndex: 'annotateperson',
            key: 'annotateperson',
            width:"10%",
            filteredValue: filteredInfo.annotateperson || null,
            onFilter: (value, record) =>record.annotateperson.includes(value)
        }, {
            title: '标注时间',
            dataIndex: 'tagtime',
            key: 'tagtime',
            width:"18%"
        }, {
            title: '完成度',
            dataIndex: 'completiondegree',
            key: 'completiondegree',
            width:"14%"
        } ,{
            title: '操作',
            dataIndex: 'editor',
            key: 'editor',
            render: (text,recoder) => {
                return (
                    <div>
                        <Popover placement="left" title={recoder.name.props.title+"文档事件详情"} overlayStyle={{width:"579px",lineHeight:"50px"}} content={this.state.content} trigger="click">
                            <a style={{marginRight:"18px"}} onClick={(e,recoders)=>this.seeEventList(e,recoder)}>查看</a>
                        </Popover>

                        <a href={"#/label/"+recoder.eventTemplateId+"&"+recoder.resourceId+"&"+this.props.artificialcorrection.noticeTitle} target="_blank">标注</a>

                    </div>
                );
            }
        }];
        return(
           <PageContainer
               areaLeft = {
                   <div style={{height:'100%'}}>
                       <WrapTabs
                           style={{padding:'0 28px 0 32px'}}
                           tabList={TAB_LIST}
                           // tabOnChange={e=>{this.tabOnChange(e)}}
                           currentTab="dataCheck"
                       />
                       <div style={{marginLeft:32}}>
                       <WrapTree treeData={conceptList}
                           // titleBtn={
                           //     <span>
                           //                  <Icon type="plus" style={{color: '#3963b2', marginRight: 5}} onClick={this.handleAddEntity} />
                           //                  <Popconfirm title="确定删除吗？" okText="确定" cancelText="取消" onConfirm={this.handleDeleteEntity}>
                           //                      <Icon type="delete" style={{color: '#3963b2', marginRight: 5}}/>
                           //                  </Popconfirm>
                           //                  <Icon type="share-alt" style={{color: '#3963b2'}} />
                           //              </span>
                           // }
                           onLoadAction={this.props.actions.onLoadEntityTreeData}
                           selectedKeys={entityTreeSelectInfo.entityTreeSlecetKey}
                           onSelect={this.entityTreeOnSelect}
                       /></div>
                   </div>
               }
               areaRight={
                   <div style={{padding:"0 32px",height:"100%"}}>
                       <p className="ManualErrorCorrectionTitle">{noticeTitle+"公告列表"}</p>
                        <div style={{textAlign:"right",marginBottom:"18px"}}>
                           <Select defaultValue="all" className="ScreeningConditions" onSelect={this.setAgeSort} >
                               <Option value="all">所有</Option>
                               <Option value="person">人工标引</Option>
                               <Option value="machine">机器标引</Option>
                           </Select>
                           <Popover placement="bottom" title={text} overlayStyle={{width:"343px"}} content={content} trigger="click">
                               <Button className="ScreeningConditionsNew" >完成度：{this.state.progressStart}%-{this.state.progressEnd}%<Icon type="down" /></Button>
                           </Popover>
                           <Search
                               placeholder="搜索公告名称/关键词"
                               onSearch={this.search}
                               className="ScreeningConditionsNew"
                               enterButton
                           />
                       </div>
                       <Table className="labelTable" locale={{emptyText:"暂无数据"}} pagination={{defaultPageSize:6,total:totalPage,onChange:this.pageChange}}  columns={this.columns} bordered={true} dataSource={getTableContent}  />
                   </div>

               }
           />
        )
    }
}
