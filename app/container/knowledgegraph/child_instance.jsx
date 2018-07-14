import { Col, Row, Table, message, Popconfirm, Button, Input, Modal, Tooltip } from 'antd';
import Card from 'app_component/card';
import NewBtn from 'app_component/newBtn';
import knowledgegraphApi from 'app_api/knowledgegraphApi';
import Child03 from './child_upload_download';
const EditableCellInput = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);
export default class Child extends React.Component{
    constructor(props){
        super(props);
        this.editItemOldData = {};
        this.state = {
            tableData: this.props.tableData.entityItemList,
            table2Data: [],
            currentAttrName: '',
            isEdit: false,
            tableIndexKey:"",
            isRelation:this.props.isRelation,
            expand:true,
            visible: false,
            tableChildData:[
                    {
                        key:"",
                        name:"",
                        value:""
                    }
                ],
            expandStatus:true,
            expandName:[],
            childEditKey: '',
            childInputValue: ''
        };
        this.columns = [{
            title: '实例名称',
            dataIndex: this.state.isRelation?'name':'eventName',
            key: this.state.isRelation?'name':'eventName',
            width:'35%',
            render: (text, record) => this.renderColumns(text, record, 'name',"tableData")
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width:'30%',
            render: (text, record) => this.renderColumns(text, record, 'description',"tableData")
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: '35%',
            render: (text, record) => {
                const { editable } = record;
                const propDisabled = this.state.isRelation?(Object.keys(record.attrMap).length + record.relationList.length) === 0:
                    (Object.keys(record.entities).length + record.predicate.length) === 0;
                const propStyle = propDisabled?{marginRight:10,color:'#666'}:{marginRight:10}
                return (
                    <div>
                        {
                          editable ? <span>
                              <a onClick={(e) => this.save(record.key,'tableData', e)} style={{marginRight:10}}>保存</a>
                              <a onClick={(e) => this.cancel(record.key,'tableData', e)}>取消</a>
                          </span>
                            : <span>
                                <Tooltip title={propDisabled?'暂无属性':''}>
                                    <a onClick={(e) => this.watch(record, e, propDisabled)} style={propStyle}>属性</a>
                                </Tooltip>
                                {this.props.isRelation?<a onClick={(e) => this.edit(record,"tableData", e)} style={{marginRight:10}}>编辑</a>:null}
                                <Popconfirm title="确定删除吗？" onClick={(e) => this.deleteClick(record.key, e)} onCancel={(e) => this.deleteClick(record.key, e)} okText="确定" cancelText="取消" onConfirm={(e) => this.delete(record,e)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </span>
                        }
                    </div>
                );
            }
        }];
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            tableData: nextProps.tableData.entityItemList,
            tableDataTotal:nextProps.tableData.entityItemCount,
            isEdit: false,
            isRelation:nextProps.isRelation
        });
        if (nextProps.isRelation) {
            this.columns[0].dataIndex = 'name';
            this.columns[0].key = 'name';
        }else {
            this.columns[0].dataIndex = 'eventName';
            this.columns[0].key = 'eventName';
        }
        this.editItemOldData = {};
    }

    save = async(key,type,e) => {
        let keys = key;
        e.stopPropagation();
        let target=null;
        let newData=null;
        let targets=null;
        if(type==="tableChildData"){
            console.log(' in table child save');
            newData = [...this.state.tableData];
            target = newData.filter(item => this.state.expandName[0] === item.key)[0];
            target.attrMap[this.state.childEditKey] = this.state.childInputValue;
            this.setState({
                childEditKey: '',
                childInputValue: '',
                isEdit: false,
                tableData: newData
            })
        }else{
            newData = [...this.state.tableData];
            target = newData.filter(item => key === item.key)[0];
        }
        if (target.name === '') {
            message.info('请填写实例名称！')
            return
        }
        if (target) {
            const {key, editable, ...rest} = target;
            if (key === 'none') {
                //add
                const result = await knowledgegraphApi.insertEntity(rest);
                

                if (result) {
                    target.key = result;
                    target.id = result;
                    delete target.editable;
                    this.setState({ tableData: newData, isEdit: false,expand:true });
                }
                this.changePage(1, 6);
            }else {
                // update
                const result = await knowledgegraphApi.updateEntity(rest);
                

                if (result) {
                    delete target.editable;
                    this.setState({ tableData: newData, isEdit: false, expand:true});
                }
            }
        }
    }

    cancel = (key,type,e) => {
        e.stopPropagation();
        if (type === 'tableChildData') {
            this.setState({childEditKey: '', childInputValue: '', isEdit: false})
            return
        }
        const newData = [...this.state[type]];
        if (key === 'none') {
            newData.shift();
            this.setState({ [type]: newData, isEdit: false,expand:true });
        }else {
            // delete this.editItemOldData.editable;
            const returnData = newData.map((item,index) => {
                delete item.editable;
                return key === item.key?this.editItemOldData:item
            });
            this.setState({ [type]: returnData, isEdit: false,expand:true });
        }
        this.props.editStatus(false);
    }

    edit = (record, type, e) => {
        e.stopPropagation();
        // if (key.indexOf('noEdit')>-1) {
        //     return
        // }
        if (!this.state.isEdit) {
            if (type === 'tableChildData') {
                this.setState({childEditKey: record.key, childInputValue: record.value, isEdit: true})
                return
            }
            const newData = [...this.state.tableData];
            const target = newData.filter(item => record.key === item.key)[0];
            this.editItemOldData = {...target};
            if (target) {
                target.editable = true;
                this.setState({
                    [type]: newData,
                    isEdit: true,
                    expand:false
                });
            }
            this.props.editStatus(true)
        }else {
            message.info('急什么，先把上一条处理了在说！');
        }
    };

    delete = async(record,e) => {
        e.stopPropagation();
        if (!this.state.isEdit) {            
            const result = await knowledgegraphApi[this.props.isRelation?'deleteEntityById':'deleteEventById']({id: record.id});
            message.success('删除成功');
            const newData = [...this.state.tableData];
            let tableIndex;
            newData.map((item,index)=>{
                if (item.key === record.key) {
                    tableIndex = index;
                }
            })
            console.log('this.props.delete：', this.props);
            newData.splice(tableIndex, 1);
            this.setState({ tableData: newData});
            
            // this.props.deleteSelectedItem({
            //     index: tableIndex, 
            //     count: 1
            // });
    
        }else {
            message.info('急什么，先把上一条处理了在说！');
        }
    }

    deleteClick=(record,e)=>{
        e.stopPropagation();
    }

    watch = (args, e, propDisabled) => {
        e.stopPropagation();
        if(args.editable) return; //修改或者添加状态是行点击不展开
        if(propDisabled){
            message.info('别点了，这下面没有属性');
            this.setState({
                expandStatus:false
            });
            return
        }else{
            // const data = [];
            // let index=0;
            // for(let key in args.attrMap){
            //     index++;
            //     data.push({
            //         key: args.key+index,
            //         name: key,
            //         value: args.attrMap[key],
            //     });
            // }
            this.setState({
                // tableChildData:data,
                expandStatus:true,
                expandName:args.key===this.state.expandName[0]?[]:[args.key]
            })
        }
    }

    handleChange = (value, key, column,type) => {
        const newData = [...this.state[type]];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ [type]: newData });
        }
    }

    renderColumns(text, record, column, type) {
        return (
            <EditableCellInput
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column,type)}
            />
        );
    }

    addNewInstance = () => {
        const NEW_ITEM_MAP = {
            "attrMap": {},
            "createTime": "",
            "description": "",
            "idPath": "",
            "importType": "manual",
            "isdel": 0,
            "name": "",
            "photoBase64": "",
            "pid": "",
            "relationList": [],
            "resourceId": "",
            "state": "2",
            "updateTime": "",
            "editable": true,
            key:'none'
        }

        if (this.props.isRelation) {
            this.props.entityTreeSelectInfo.entityTreeSlecetItem.attrList.map(item=>{
                NEW_ITEM_MAP.attrMap[item.name] = '';
            })
        }
        NEW_ITEM_MAP.pid = this.props.pid;
        NEW_ITEM_MAP.idPath = this.props.idPath;
        this.setState({
            tableData: [NEW_ITEM_MAP, ...this.state.tableData],
            isEdit: true,
            expand:false
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
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

    childInputOnChange = (value) => {
        this.setState({childInputValue: value})
    }

    renderChildColumns = (value, record) => {
        if (this.state.childEditKey === record.key) {
            return <Input style={{ margin: '-5px 0' }} value={this.state.childInputValue} onChange={e => this.childInputOnChange(e.target.value)} />
        }else {
            return value
        }
    }
    changePage=(page,pageSize)=>{
        this.props.wrapTabs({
            page:page,
            pageSize:pageSize
        })
    }
    expandedRowRender = (args) => {
        const columns = [
            {
                title: '属性名称',
                dataIndex: 'name',
                key: 'name' ,
                width:'35%'
            },
            {
                title: '属性值',
                key: 'value',
                dataIndex:'value',
                width:'35%',
                render: (text, record) => this.renderChildColumns(text, record, 'value','tableChildData')
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width:'30%',
                render: (text, record) => {
                    const childStyle = record.key.indexOf('noEdit')>-1?{marginRight:10,color:'#666'}:{marginRight:10}
                    return (
                        <div>
                            {
                                this.state.childEditKey === record.key ? <span>
                              <a onClick={(e) => this.save(record.key,'tableChildData', e)} style={{marginRight:10}}>保存</a>
                              <a onClick={(e) => this.cancel(record.key,'tableChildData', e)}>取消</a>
                          </span>
                                    : <span>
                                <a onClick={(e) => this.edit(record,'tableChildData', e)} style={childStyle}>编辑</a>
                            </span>
                            }
                        </div>
                    );
                }
            },
        ];
        let tableChildData = [];
        if (this.props.isRelation) {
            for(let key in args.attrMap){
                tableChildData.push({
                    key: key + args.attrMap[key],
                    name: key,
                    value: args.attrMap[key]
                });
            }
            args.relationList.map(item=>{
                tableChildData.push({
                    key: item.id+'-noEdit',
                    name: item.name,
                    value: item.endNodeName
                })
            })
        }else {
            tableChildData = [
                {
                    name:'时间',
                    value:args.eventTime,
                    key:args.eventTime+'1-noEdit'
                },{
                    name:'地点',
                    value:args.location,
                    key:args.location+'location-noEdit'
                },{
                    name:'发布时间',
                    value:args.resourceInfo.publishTime,
                    key:args.resourceInfo.publishTime+'publishTime-noEdit'
                },{
                    name:'站点',
                    value:args.resourceInfo.siteId,
                    key:args.resourceInfo.siteId+'siteId-noEdit'
                },{
                    name:'站点名称',
                    value:args.resourceInfo.websiteName,
                    key:args.resourceInfo.websiteName+'websiteName-noEdit'
                },{
                    name:'url',
                    value:args.resourceInfo.url,
                    key:args.resourceInfo.url+'url-noEdit'
                }
            ]
            args.entities.map((item,index)=>{
                tableChildData.push({
                    name:item.role,
                    value:item.name,
                    key:item.name+index+'-noEdit'
                })
            })

        }

        return (
            <Table
                className="childList"
                bordered={false}
                style={{background:"#fafafa"}}
                columns={columns}
                dataSource={tableChildData}
                pagination={false}
            />
        );
    }

    handleMoadlVisible = (arg) =>{
        this.setState({
            visible:arg
        })
    }

    render(){
        const { entityTreeSelectInfo} = this.props;
        // this.props.actions.initKnowledgegraph() 
        // console.log('子：', this.props);

        return (
            <div style={{height:"100%"}}>
                <div style={{marginBottom:"18px"}} className="newButtons">
                    {this.props.isRelation?<NewBtn text='添加实例' onClick={this.addNewInstance} disabled={this.state.isEdit} icon='plus' type='D' />:null}
                    <NewBtn text='上传本地实例' onClick={this.showModal} icon='upload' type='D' />
                </div>
                    <Card
                        title='实例列表'
                        body={
                            <Table
                                className="components-table-demo-nested"
                                id="tableList"
                                style={{background:"#FCFCFC",width: '100%'}}
                                bordered
                                columns={this.columns}
                                expandedRowRender={this.expandedRowRender}
                                dataSource={this.state.tableData}
                                expandRowByClick={this.state.expand}
                                expandedRowKeys={this.state.expandName}
                                rowKey={args=>args.key}
                                pagination={{pageSize: 6,total:this.props.tableData.entityItemCount,onChange:this.changePage}}
                                locale={{emptyText: '该实体下暂无实例数据'}}
                                scroll={{y: 325}}
                                rowClassName={(record, index) => record.key==="none"?"newRow":""}
                                onRow={(record) => {
                                    return {
                                        // onClick: () => {
                                        //     console.log('this的含义是：', this);
                                        //     this.onExpandTable(record)
                                        // }
                                    };
                                }}
                                // onRow={(record) => {
                                //     return {
                                //         onClick: () => {this.onExpandTable(record)},       // 点击行
                                //     };
                                // }}
                            />
                        }
                    />
                <Modal
                    title="上传本地实例"
                    visible={this.state.visible}
                    wrapClassName="vertical-center-modal"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="cancel"  onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="confirm" type="primary" onClick={this.handleOk}> 确定</Button>
                    ]}
                    footer={false}
                >
                    <Child03 info={entityTreeSelectInfo} isClose={res=>{
                        this.handleMoadlVisible(res)
                    }}/>
                </Modal>
            </div>
        )
    }
}
