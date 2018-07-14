import { Input, Button, Form, Modal, message, Popconfirm, Icon, Tooltip } from 'antd';
const { TextArea,Search } = Input;

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from 'actions/typesystem';

import PageContainer from 'app_component/pagecontainer';
import TagList from 'app_component/taglist';
import WrapTabs from 'app_component/tabs';
import Card from 'app_component/card';
import NewBtn from 'app_component/newBtn';
import NavLabel from 'app_component/navLabel';
import FormItemFactory from 'app_component/formitemfactory';

import './index.css';

const tabMap = {
    entityType:'实体',
    eventType:'事件',
    relationType:'关系',
    attributionType:'属性'
}

const TAB_LIST = Object.keys(tabMap).map((i, index)=>{
    return {
        name:tabMap[i],
        key:i
    }
})

const mapStateToProps = state => {
    return {typesystem: state.get('typesystem').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const FORM_ITEM_LIST = {
    entityType:[
        {
            label:'名称',
            id:'typeName',
            key:'entityType_1',
            type:'input',
            placeholder:'必填'
        },
        {
            label:'描述',
            key:'entityType_2',
            id:'typeDescription',
            type:'inputArea',
            required:false,
            placeholder:'选填'
        },
        {
            label:'图片',
            key:'entityType_3',
            id:'photo_base64',
            type:'uploadImg',
            required:false,
        }
    ],
    eventType:[
        {
            label:'名称',
            id:'typeName',
            key:'eventType_1',
            type:'input',
            placeholder:'必填'
        },
        {
            label:'描述',
            key:'eventType_2',
            id:'typeDescription',
            type:'inputArea',
            required:false,
            placeholder:'选填'
        }
    ],
    relationType:[
        {
            label:'名称',
            key:'relationType_1',
            id:'typeName',
            type:'input',
            placeholder:'必填'
        },
        {
            label:'描述',
            key:'relationType_2',
            id:'typeDescription',
            type:'inputArea',
            required:false,
            placeholder:'选填'
        },
        {
            label:'对象1',
            id:'entityType_start',
            key:'relationType_3',
            type:'select',
            selectGroup: true,
            options:[],
            placeholder:'必填'
        },
        {
            label:'对象2',
            key:'relationType_4',
            id:'entityType_end',
            type:'select',
            selectGroup: true,
            options:[],
            placeholder:'必填'
        }
    ],
    attributionType:[
        {
            label:'名称',
            id:'typeName',
            key:'attributionType_1',
            type:'input',
            placeholder:'必填'
        },
        {
            label:'值',
            key:'attributionType_2',
            id:'attrValueType',
            type:'select',
            options:[
                {
                    label:'整数值',
                    value:'int'
                },
                {
                    label:'浮点值',
                    value:'float'
                },
                {
                    label:'布尔值',
                    value:'bool'
                },
                {
                    label:'日期时间',
                    value:'datetime'
                },
                {
                    label:'日期',
                    value:'date'
                },
                {
                    label:'时间',
                    value:'time'
                },
                {
                    label:'字符串',
                    value:'string'
                },
                {
                    label:'范围型',
                    value:'range'
                },
                {
                    label:'Map型',
                    value:'map'
                }
            ],
            placeholder:'必填'
        },
        {
            label:'所属对象',
            key:'attributionType_3',
            id:'belongedType',
            type:'select',
            mode:'multiple',
            selectGroup: true,
            options:[],
            placeholder:'必填'
        },
        {
            label:'备注',
            key:'attributionType_4',
            id:'typeDescription',
            type:'inputArea',
            required:false,
            placeholder:'选填'
        }
    ]
}

const bindFieldValues = (FORM_ITEM_LIST,props) => {
    let fieldObj = {};
    const currentTab = props.typesystem.currentTab;
        FORM_ITEM_LIST[currentTab].map(formItem=>{
            fieldObj[formItem.id] = Form.createFormField({
                ...props.typesystem.formData[formItem.id]
            })
        })
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
export default class TypeSystem extends React.Component {

    constructor(props){
        super(props)
        this.selectOptsMap = {};
    }

    componentDidMount(){
        //获取页面左侧类型列表
        this.props.actions.gettargetlist();
    }

    tabOnChange = (e) => {
        //切换tab        
        this.props.actions.changeTab(e);
        // this.currentTagIndex = 0;
    }

    handleSearchEvent = (keyword) => {        
        //the same keyword return
        if (keyword === this.props.typesystem.prevKeyword) return
        //搜索
        this.props.actions.search({keyword,type:this.props.typesystem.currentTab});
        // this.currentTagIndex = 0;
    }

    taglistOnClick = (activeTag,e,index) => {
        //选择列表tag
        this.props.actions.editTag(e, index);        
    }

    getFormList = () => {
        const {tagList, currentTab, isEdit} = this.props.typesystem;
        if (currentTab === 'relationType' || currentTab === 'attributionType') {
            const {entityType, eventType} = tagList;
            this.selectOptsMap = {};
            const entityTypeChild = entityType.map(item=>{
                this.selectOptsMap[item.value] = {
                    mongoId: item.value,
                    type: 'entityType',
                    typeName: item.label
                }
                return item
            })
            const eventTypeChild = eventType.map(item=>{
                this.selectOptsMap[item.value] = {
                    mongoId: item.value,
                    type: 'eventType',
                    typeName: item.label
                }
                return item
            })

            const entityTypeOpt = [{
                label: tabMap['entityType'] + '类型',
                key: 'entityType',
                children: entityTypeChild
            }]
            const eventTypeOpt = [{
                label: tabMap['eventType'] + '类型',
                key: 'eventType',
                children: eventTypeChild
            }]
            const formList = FORM_ITEM_LIST[currentTab];
            formList.map(form=>{
                form.disabled = !isEdit;
                if (form.id === 'entityType_start' || form.id === 'entityType_end') {
                    form.options = entityTypeOpt;
                }else if(form.id === 'belongedType'){
                    form.options = [...entityTypeOpt, ...eventTypeOpt];
                }
            });
            return formList
        }else {
            const formList = FORM_ITEM_LIST[currentTab];
            formList.map(form=>{
                form.disabled = !isEdit;
            });
            return formList
        }
    }

    deleteCurrentType = (info) => {
        this.props.actions.deleteActiveTag({info,CB:()=>{
            message.success('删除成功');
        }});
    }

    //form提交
    formCheck = () => {
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    let params = values;
                    if (this.props.typesystem.currentTab === 'relationType') {
                        const {entityType_end, entityType_start, ...rest} = values;
                        params = {...rest,
                            entityType_end: this.selectOptsMap[entityType_end],
                            entityType_start: this.selectOptsMap[entityType_start]
                        }
                    }else if(this.props.typesystem.currentTab === 'attributionType'){
                        const {belongedType, ...rest} = values;
                        params = {...rest, belongedType:belongedType.map(i=>{
                            return this.selectOptsMap[i]
                        })};
                    }
                    const isAdd = !this.props.typesystem.activeTag;
                    if (isAdd) {
                        this.props.actions.addTag(params, ()=>{
                            message.success('添加成功');
                        });
                    }else {
                        this.props.actions.updateTag(params, ()=>{
                            message.success('编辑成功');
                        });
                    }
                }
            }
        );
    }

    checkModalHandleCancel = () => {
        this.props.actions.needCloseEditArea(false);
    }

    checkModalHandleOk = () => {
        this.props.actions.needCloseEditArea(true);
    }

    //清空form
    formCancel = () => {
        this.props.actions.cleanFormValues();
    }
    //添加实体
    wantAddTag = () => {
        this.props.actions.wantAddTag();
    }

    //带两个参数，返回类型
    //是否是编辑， 如果是编辑状态，将参数填写去，是添加状态返回空的form
    getEditArea = (isAdd) => {
        const { getFieldDecorator } = this.props.form;
        const elseData = {isUpdate: this.props.typesystem.currentFormIsUpdate, isAdd}
        return (
            <div className='ts-mainarea-right-content'>
                <FormItemFactory
                    getFieldDecorator={getFieldDecorator}
                    formList={this.getFormList()}
                    elseData={elseData}
                    noBtn={!this.props.typesystem.isEdit}
                    onSubmit={this.formCheck}
                    onCancel={this.formCancel}
                />
            </div>
        )
    }

    todoEdit = () => {
        this.props.actions.todoEdit();
    }

    render() {
        const {typesystem:{activeTag,activeTagName,isSearch,searchResultList,searchKeyword,
            currentTab,currentFormIsUpdate,tagList,checkModal}} = this.props;
        const renderTagList = isSearch?searchResultList:tagList[currentTab] || [];
        const SearchInput = (
            <Search
                placeholder="请输入关键字"
                value={searchKeyword}
                onChange={(e)=>{this.props.actions.changeSearchKeyword(e.target.value)}}
                onPressEnter={(e)=>{this.handleSearchEvent(e)}}
                onSearch={(e)=>{this.handleSearchEvent(e)}}
                enterButton
                style={{marginBottom:10}}
            />
        )
        const editOrAdd = !!activeTag?'编辑':'添加';
        return (
            <PageContainer
                areaLeft = {
                    <div className='sp-flex-box ts-mainarea-left'>
                        <WrapTabs
                            style={{padding:'0 28px 0 32px'}}
                            tabList={TAB_LIST}
                            tabOnChange={e=>{this.tabOnChange(e)}}
                            currentTab={currentTab}
                            className="wrapHideMargin"
                        />
                        <NavLabel text={tabMap[currentTab]+'类型'} elseOpt={<Tooltip title={`添加${tabMap[currentTab]}类型`}><Icon type="plus" onClick={this.wantAddTag} /></Tooltip>} />
                        <div className='ts-mainarea-left-taglist'>
                            <TagList
                                data={renderTagList}
                                onClick={this.taglistOnClick}
                                activeTag={activeTag}
                                operateRender={[{
                                    icon:'delete',
                                    key:'delete',
                                    popconfirm:{
                                        title:'确定删除吗？',
                                        onConfirm:(info)=>{this.deleteCurrentType(info)}
                                    }
                                }]}
                            />
                        </div>

                        <div className='ts-mainarea-left-btn-div'>
                            <NewBtn text='导入文件' type='B' style={{marginRight: 12}}/>
                            <NewBtn text='导出文件' type='B' />
                        </div>
                    </div>
                }
                areaRight = {
                    <div className='sp-flex-box' style={{flexDirection: 'column',height: '100%'}}>
                        <div className='ts-mainarea-right-title'>
                            <span style={{fontWeight: 'bold'}}>{!!activeTag?'当前'+tabMap[currentTab]+'类型：'+activeTagName:'新建'+tabMap[currentTab]+'类型'}</span>
                            <span style={{float:'right'}}>
                                <NewBtn text='修改信息' onClick={this.todoEdit} icon='edit' type='D' />
                            </span>
                        </div>
                        {this.getEditArea(!activeTag)}
                        <Modal
                            visible={checkModal}
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
