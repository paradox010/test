import { Icon, Button, Form, message, Table, Popconfirm,Modal,Radio ,InputNumber,Spin } from 'antd';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/knowledgegraph';
//import { ActionCreators as UndoActionCreators } from 'redux-undo';undo和imuutable不兼容，会出现未知错误
import * as graphActions from 'actions/graphdata'

import PageContainer from 'app_component/pagecontainer';
import WrapTabs from 'app_component/tabs';
import TagList from 'app_component/taglist';
import WrapTree from 'app_component/tree';
import WrapCard from 'app_component/card';
import FormItemFactory from 'app_component/formitemfactory';
import Chart from 'app_component/chart';

import NavLabel from 'app_component/navLabel';
import NewBtn from 'app_component/newBtn';
import Child01 from './child_instance';
import Child02 from './child_prop_table';
import Child03 from './child_upload_download';

import './index.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TAB_LIST = [
    {
        name: '实体',
        key: 'entity'
    }, {
        name: '事件',
        key: 'event'
    }
];

const FORM_ITEM_LIST = [
    {
        label:'名称',
        key:'name',
        id:'name',
        type:'input'
    },
    {
        label:'父概念',
        id:'pid',
        key:'pid',
        type:'select',
        options:[]
    },
    {
        label:'描述',
        key:'description',
        id:'description',
        type:'inputArea',
        required:false,
    },
    {
        label:'图片',
        key:'photoBase64',
        id:'photoBase64',
        type:'uploadImg',
        required:false,
    }
]




const mapStateToProps = state => {
    return {knowledgegraph: state.get('knowledgegraph').toJS(),
		   	graphdata:state.get('graphdata').toJS()
		   }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
	graphActions:bindActionCreators(graphActions, dispatch),
//	onUndo: () => dispatch(UndoActionCreators.undo()),
//	onRedo: () => dispatch(UndoActionCreators.redo())
});

const bindFieldValues = (FORM_ITEM_LIST,props) => {
    let fieldObj = {};
    FORM_ITEM_LIST.map(formItem=>{
        fieldObj[formItem.id] = Form.createFormField({
            ...props.knowledgegraph.formData[formItem.id]
        })
    });
    return fieldObj
}

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
    onFieldsChange(props, changedFields) {
        props.actions.mergeFieldsValues(changedFields);
    },
    mapPropsToFields(props) {
        return bindFieldValues(FORM_ITEM_LIST,props)
    }
})
export default class Knowledgegraph extends React.Component{
    constructor(props){
        super(props)
        this.TableColumns = [
            {
                title: '事件名称',
                dataIndex: 'eventName',
                key: 'eventName',
                width: '15%'
            }, {
                title: '时间',
                dataIndex: 'eventTime',
                key: 'eventTime',
                width: '15%'
            }, {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: '30%'
            }, {
                title: 'url',
                dataIndex: 'url',
                key: 'url',
                width: '25%'
            },{
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '15%',
                className: 'df-table-columns-line',
                render: (text, record) => (
                    <span style={{color: '#3963b2',cursor: 'pointer'}}>
                        <span style={{marginRight: 15}} onClick={()=>{this.showModal(record)}}>详情</span>
                        <span>
                            <Popconfirm placement="bottom" title="确定删除？" okText="确定" onConfirm={this.deleteInfo.bind(this,record)} cancelText="取消">
                                <span>删除</span>
                            </Popconfirm>
                        </span>
                    </span>
                )
            }
        ];
        this.detailColumns = [
            {
                title: 'name',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: 'role',
                dataIndex: 'role',
                key: 'role',
            }, {
                title: 'type',
                dataIndex: 'type',
                key: 'type',
            }
        ];
		this.option={
			tooltip: {
				formatter: function (params) {
					if (params.dataType === 'node') {
						var ttr = '';
						for(let t in params.data.attrMap){
							ttr+='<div>'+t+':'+params.data.attrMap[t]+'</div>'
						}
						const t = "display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:"+params.color;
						return '<span style='+t+'>'
						+'</span>'+params.value+ttr
					}
					if(params.dataType==='edge'){
                		return params.marker+params.data.value;
            		}
				}
			},
			animationDurationUpdate: 1500,
			animationEasingUpdate: 'quinticInOut',
			legend: {
				left: "right",
				top:'bottom',
				padding: [20,5],
				orient:'vertical',
				show: true,
				data: []
			},
			series: [
				{
					type: 'graph',
					layout: 'force',
					symbolSize: 45,
					focusNodeAdjacency: true,
					roam: true,
//					draggable: true,
					categories: [],
					label: {
						show: true,
						textStyle: {
							fontSize: 12
						},
						formatter:'{c}'
					},
					force: {
						repulsion : 180,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                		gravity : 0.03,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                		edgeLength :80,
					},
					itemStyle: {
//						borderColor: '#fff',
//						borderWidth: 1,
//						shadowBlur: 10,
//						shadowColor: 'rgba(0, 0, 0, 0.3)'
					},
					edgeSymbolSize: [4, 5],
					edgeSymbol: ['', 'arrow'],
					lineStyle: {
						color: 'source',
					},
					emphasis: {
						lineStyle: {
							width: 2
						},
						edgeLabel:{
							fontWeight:'bolder'
						}
					},
					edgeLabel: {
						//show: true,
						textStyle: {
							fontSize: 12
						},
						formatter: '{c}'
					},
					nodes: [],
					links: []
				}
			]
		};
        this.state = {
            visible: false,
            lfType: null,
            detailInfo:{
                eventName:"",
                eventTime:"",
                key:"",
                url:"",
                title:""
            },
            editInfo:true,
            detailTable:[{
                name:"",
                role:"",
                type:"",
                key:""
            }],
            selectKey: [],
            elem: '',
            selectId: ''
        };
    }

    componentDidMount(){
        this.props.actions.initKnowledgegraph()      
        
    }
    deleteInfo=(data,event)=>{           
        this.props.actions.deleteEvent({id:data.deleteId},{index:data.index});
        message.success('删除成功');
    }
	dblClickNode=(params,noExpand)=>{
		//扩展图并且重置中心点//重置当前节点
		if(noExpand){
			//重置当前节点
			this.props.graphActions.changeSelectedNode(params)
		}else{
			this.props.graphActions.expandGraph(params)
		}
	}
    showModal = (data) => {
        this.setState({
            visible: true,
            detailInfo:data,
            detailTable:[{
                name:data.entities.length>0?data.entities[0].name:"",
                role:data.entities.length>0?data.entities[0].role:"",
                type:data.entities.length>0?data.entities[0].type:"",
                key:data.key
            }],
            changeEditStatus:false
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    getFormList = () => {
        const {currentFormIsAdd, entityTreeSelectInfo:{entityTreeSlecetPValue, entityTreeSlecetPLabel, entityTreeSlecetLabel, entityTreeSlecetValue},isEdit} = this.props.knowledgegraph;
        if (currentFormIsAdd) {
            const {title, key, value} = this.props.knowledgegraph.addToDoData;
            FORM_ITEM_LIST[1].options = [{
                label: title,
                key,
                value
            }]
        }else {
            if (entityTreeSlecetPValue === '0') {
                FORM_ITEM_LIST[1].options = [{
                    label: '暂无',
                    key: '0',
                    value: '0'
                }]
            }else if(entityTreeSlecetPValue){
                FORM_ITEM_LIST[1].options = [{
                    label: entityTreeSlecetPLabel,
                    key: entityTreeSlecetPValue,
                    value: entityTreeSlecetPValue
                }]
            }
        }
        FORM_ITEM_LIST.map(formItem=>{
            if(this.props.knowledgegraph.currentFormIsAdd===false){
                formItem.disabled=!isEdit
            }else{
                formItem.disabled=false
            }
        });
        return FORM_ITEM_LIST
    }
    //修改信息
    todoEdit = () => {
        this.props.actions.todoEdit();
        this.setState({
            editInfo:false
        })
    }
    tabOnChange = (e) => {
        //切换tab
        this.props.actions.changeTab({currentTab: e});

    };
    //定义/实体/属性切换判断状态
    changeEditStatus=(res)=>{
        this.setState({
            changeEditStatus:res
        })
    };
    wrapTabsStatus=(status)=>{        
        status['currentTab']=this.props.knowledgegraph.currentTab;
        // 实体的初始化数据
        this.props.actions.entryShowInstance(status);
    }
    deleteSelectedItem=(res)=>{
        this.props.actions.deleteSelectedItem(res);
    }
    // 实例/定义/属性|角色 tab切换
    entryShowInstances = (e) => {          
        let cTab = this.props.knowledgegraph.currentTab;          
        if(!this.state.changeEditStatus){ 
            this.props.actions.changeRenderType(e.target.value)
            
            if(e.target.value === 'example') {
                this.wrapTabsStatus({
                    page: 1,
                    pageSize: 6
                })          
            }

            if(e.target.value === 'property') {
                let selectId = null;
                let selectIdPath = null;
                let defaultId = this.props.knowledgegraph.defaultId;
                let defaultPath = `0/${this.props.knowledgegraph.defaultId}`;
                let selectKey = this.state.selectKey;
                let elem = this.state.elem;  

                if(!elem.node) {
                    selectId = defaultId;
                    selectIdPath = defaultPath;
                }else{
                    selectId = elem.node.props.nodeValue;
                    selectIdPath = elem.node.props.idPath;
                }              


                this.props.actions.changeEntityTreeSelect({
                    selectKey, 
                    selectValue: selectId, 
                    selectIdPath: selectIdPath,
                    currentTab: cTab,
                    subTab: e.target.value
                })
                 
            }                
        }else{
            this.props.actions.changeFormStatus(e.target.value);
            this.setState({
                changeEditStatus:this.props.knowledgegraph.radiosChangeStatus
            })
        }
    }
    //点击树节点触发对应数据
    entityTreeOnSelect = (selectKey, e) => {      
        if (selectKey.length) {
            //事件初始化数据       
            this.setState({selectKey: selectKey, elem: e});    
            this.props.actions.changeEntityTreeSelect({selectKey, selectValue: e.node.props.nodeValue, selectIdPath: e.node.props.idPath})
        }
    }
    formCheck = (isAdd) => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    if (isAdd) {
                        this.props.actions.addEntityBaseInfo({values, CB: ()=>{
                            message.success('添加成功')

                        }})
                    }else {
                        this.props.actions.updateEntityBaseInfo({values, CB: ()=>{
                            message.success('编辑成功')
                        }})
                    }
                }
            }
        );
    }
    formCancel = () => {
        this.props.actions.resetFieldsValues();
    }
    formAbandon=()=>{
        this.props.actions.changeTabStatus({
            payload:"example"
        });        
        this.props.actions.changeRenderType("example")        
    }
    formAbandonEdit=()=>{
        if(this.props.knowledgegraph.renderType==="detail"){
            this.props.actions.toDoNotEdit();
            this.setState({
                editInfo:true
            })
        }
    }
    handleAddEntity = (info) => {        
        this.props.actions.enterAddEntity(info);
    }

    handleDeleteEntity = (info) => {        
        this.props.actions.deleteAddEntity({info,CB: ()=>{
            message.success('删除成功')
        }});
    }
    handleShowGraph = info => {
//        {title:"电脑"
//		value:"5b3c96286a3b6552b24848f8"}=>{value:电脑,type:concept,name:id}
		//更新图的初始数据
		this.props.actions.enterShowGraph();
		this.props.graphActions.initGraph({value:info.title,type:'concept',name:info.value})
    }
	onChangeShowEntities =(value)=>{
		this.props.graphActions.changeShowEntities(value)
	}
	getGraphPicture = ()=>{
		var myCanvas = document.getElementById("forceGraph").children[0].childNodes[0];
		// here is the most important part because if you dont replace you will get a DOM 18 exception.
		// var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");
		var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
		window.location.href=image; 

	}
	requestFullScreen = () => {
		//游览器兼容
		this.graphId.webkitRequestFullScreen()
	} 
    checkModalHandleCancel = () => {
        this.props.actions.needCloseEditArea(false);
    }

    checkModalHandleOk = () => {
        this.props.actions.needCloseEditArea(true);
    }

    taglistOnClick = (value, e) => {
        this.props.actions.changeEventActiveTag({type: e.label, value})
    }

    handleExportEntity = (e) => {
        e.stopPropagation();
        this.props.actions.changeRenderType('uploadAndDownload')
        // const {entityTreeSelectInfo} = this.props.knowledgegraph;
        // window.location.href = '/supermind/api/knowledgeGraph/exportEntityInstance?pid=' + entityTreeSelectInfo.entityTreeSlecetValue;
    }



    render(){
        let self = this;
        const {knowledgegraph: {currentTab, entityTreeData, entityTreeSelectInfo, currentFormIsUpdate,
            currentFormIsAdd, eventTagList, eventActiveTag, currentEventTagDetail, showInstance, instanceTableData,
            showEntityPropConf, renderType, copyEntityTreeData,pageIsChange}} = this.props;
        const editOrAdd = renderType==="add"?"新建":"编辑";    
		const {graphdata} = this.props
		const ButtonGroup = Button.Group;
		
        return(
            <PageContainer
                areaLeft = {
                    <div style={{height:'100%'}} id="treeList">
                    <div className='sp-flex-box kg-mainarea-left'>
                        <WrapTabs
                            style={{padding:'0 28px 0 32px'}}
                            tabList={TAB_LIST}
                            tabOnChange={e=>{this.tabOnChange(e)}}
                            currentTab={currentTab}
                        />
                        {
                            <NavLabel text={currentTab === 'entity'?'实体列表':'事件列表'} />
                        }

                        <div className='kg-mainarea-left-taglist'>
                            {
                                <div style={{marginLeft:32}}>
                                    <WrapTree
                                        treeData={entityTreeData}
                                        operateRender={
                                            [
                                                {
                                                    icon:'plus',
                                                    key:'plus',
                                                    style:{marginRight: 5},
                                                    onConfirm:this.handleAddEntity
                                                }, 
                                                {
                                                    icon:'delete',
                                                    key:'delete',
                                                    popconfirm:{
                                                        title:'确定删除吗？',
                                                        onConfirm:this.handleDeleteEntity
                                                    }
                                                }
                                             , {
                                                 icon:'share-alt',
                                                 key:'share-alt',
                                                 style:{marginLeft: 5},
                                                 onConfirm:this.handleShowGraph
                                             }
                                        ]}
                                        onLoadAction={this.props.actions.onLoadEntityTreeData}
                                        selectedKeys={entityTreeSelectInfo.entityTreeSlecetKey}
                                        onSelect={this.entityTreeOnSelect}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                    </div>
                }
                areaRight = {
                    <div style={{padding:"0 32px",height:"100%"}}>
                        {
                            renderType === 'add'
                            ?
                            <div>
                                <div className='com-card-body-title'>新建{currentTab === 'entity'?'实体':'事件'}</div>
                                <WrapCard
                                    body={
                                        <div style={{maxHeight:600,overflow:'auto',marginTop:"30px"}}>
                                            <FormItemFactory
                                                getFieldDecorator={this.props.form.getFieldDecorator}
                                                formList={
                                                    this.getFormList()
                                                }
                                                onSubmit={()=>{this.formCheck(currentFormIsAdd)}}
                                                onCancel={this.formCancel}
                                                onAbandon={this.formAbandon}
                                                elseData={{isUpdate: currentFormIsUpdate, isAdd: currentFormIsAdd}}
                                            />
                                        </div>
                                    }
                                />
                            </div>
                            :                                
                            <div style={{height:"100%"}}>
								{
									renderType === 'graph'
									?
									<div>
									</div>
											  
									:
									<div className='kg-mainarea-right-title'>
                                    {/*<span style={{fontSize:"16px",fontWeight:"bold"}}>当前：{currentTab === 'entity'?'实体列表':'事件列表'} / {entityTreeSelectInfo.entityTreeSlecetLabel}</span>*/}
                                    {
                                        <div className="radios">
                                            <RadioGroup  onChange={this.entryShowInstances} value={renderType}>
                                                <RadioButton value="example">实例</RadioButton>
                                                <RadioButton value="detail">定义</RadioButton>
                                                <RadioButton value="property">{currentTab === 'entity'?'属性':'角色'}</RadioButton>
                                            </RadioGroup>
                                            {
                                                renderType==="detail"?<span className="editRight"><NewBtn text='修改信息' onClick={this.todoEdit} icon='edit' type='D' /></span>:null

                                            }
                                        </div>
                                    }
                                	</div>
								}
                                
                                {
                                    (
                                        ()=>{
                                                if (renderType === 'example') {
                                                    return(
                                                        <Child01
                                                            tableData={instanceTableData}
                                                            pid={entityTreeSelectInfo.entityTreeSlecetValue}
                                                            idPath={entityTreeSelectInfo.entityTreeSlecetIdPath}
                                                            entityTreeSelectInfo={entityTreeSelectInfo}
                                                            isRelation={currentTab==='entity'}
                                                            editStatus={res=>{
                                                                this.changeEditStatus(res)
                                                            }}
                                                            
                                                            wrapTabs={res=>{
                                                                this.wrapTabsStatus(res)
                                                            }}
                                                        />
                                                    )
                                                }else if(renderType === "detail"){
                                                    return (
                                                        <div>
                                                            <WrapCard
                                                                body={
                                                                    <div style={{maxHeight:600,overflow:'auto',marginTop:"30px"}}>
                                                                        <FormItemFactory
                                                                            getFieldDecorator={this.props.form.getFieldDecorator}
                                                                            formList={this.getFormList()}
                                                                            noBtn={!this.props.knowledgegraph.isEdit}
                                                                            onSubmit={()=>{this.formCheck(currentFormIsAdd)}}
                                                                            onCancel={this.formCancel}
                                                                            onAbandon={this.formAbandonEdit}
                                                                            elseData={{isUpdate: currentFormIsUpdate, isAdd: currentFormIsAdd}}
                                                                        />
                                                                    </div>
                                                                }
                                                            />
                                                            {/*{*/}
                                                                {/*this.state.editInfo?<span className="editRight"><NewBtn text='修改信息' onClick={this.todoEdit} icon='edit' type='D' /></span>:null*/}

                                                            {/*}*/}

                                                        </div>

                                                    )
                                                }else if(renderType === "property"){
                                                    return (
                                                        <Child02
                                                            key={currentTab}
                                                            onSave={this.props.actions.handleEntityPropEdit}
                                                            onAdd={this.props.actions.handleEntityPropAdd}
                                                            dataSource={entityTreeSelectInfo}
                                                            treeData={copyEntityTreeData}
                                                            onLoadAction={this.props.actions.onLoadCopyEntityTreeData}
                                                            // deleteSelectedItem={res=>{
                                                            //     this.deleteSelectedItem(res)
                                                            // }}
                                                            isRelation={currentTab==='entity'}
                                                            editStatus={res=>{
                                                                this.changeEditStatus(res)
                                                            }}
                                                        />
                                                    )
                                                }else if(renderType === "graph"){
													return (
														<Spin spinning={graphdata.loading} size="large" wrapperClassName="fullscreen-spin">
														<div style={{height:'100%'}} ref={ID=>this.graphId = ID} className='fullChart' >
															<div style={{padding: '10px 5px',borderBottom:'1px solid #ccc'}}> 
																<div className="graph_options">
																	<span>当前节点：{graphdata.index>-1?graphdata.graphList[graphdata.index].selectedNode.value:'无节点'}</span>
																	<span style={{marginLeft:'10px'}}>随机显示实例：    <InputNumber min={1} max={30} defaultValue={30} onChange={this.onChangeShowEntities} />
																	</span>
																</div>
																<div className="graph_operation">
																	<ButtonGroup>
															<Button icon="arrow-left" />
															<Button icon="rollback" onClick={this.props.graphActions.undoGraph}/>
															<Button  icon="enter" style={{transform: 'rotate(180deg)'}}onClick={this.props.graphActions.redoGraph} />
															<Button icon="lock" />
															<Button icon="sync" />
															<Button icon="download" onClick = {this.getGraphPicture}/>
															<Button icon="arrows-alt" onClick={this.requestFullScreen} />
																	</ButtonGroup>
																	</div>
															</div>
															
															{graphdata.index>-1?
															<div className='graph-height' style={{height:'-webkit-calc(100% - 55px)'}}>
															<Chart height = "100%" width = "100%" type='graph' option={this.option} showEntities={graphdata.showEntities} data={graphdata.graphList[graphdata.index]} dblClick={this.dblClickNode}></Chart></div>:
															<div>无数据</div>}
														 </div>
														</Spin>
													)
												}

                                        }
                                    )()
                                }
                            </div>
                        }
                        <Modal
                            title="详情"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="submit" type="primary" onClick={this.handleCancel}>
                                    取消
                                </Button>,
                            ]}
                        >
                            <p>事件:{this.state.detailInfo.eventName}</p>
                            <p>时间:{this.state.detailInfo.eventTime}</p>
                            <p>标题:{this.state.detailInfo.title}</p>
                            <p>URL: <a href={this.state.detailInfo.url} target="_blank">{this.state.detailInfo.url}</a></p>
                            <div>
                                实体：<Table bordered={true} pagination={false} columns={this.detailColumns} dataSource={this.state.detailTable} />
                            </div>

                        </Modal>
                        <Modal
                            visible={pageIsChange}
                            okText='确定放弃'
                            cancelText={`继续${editOrAdd}`}
                            onCancel={this.checkModalHandleCancel}
                            onOk={this.checkModalHandleOk}
                        >
                            {`确定放弃当前的${editOrAdd}？`}
                        </Modal>
                    </div>


                }

            />

        )
    }
}
