import { Form, Icon, Input, Button,Radio,Select,Checkbox,message } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actions from "actions/labelaction";


const mapStateToProps = state => {
    return {label: state.get('label').toJS()}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
@connect(mapStateToProps, mapDispatchToProps)
// function hasErrors(fieldsError) {
//     return Object.keys(fieldsError).some(field => fieldsError[field]);
// }

class HorizontalLoginForm extends React.Component {
    constructor(args){
        super(args);
        this.state={
            checkboxArray:this.props.label.checkboxMenu[0],
            checkedList:this.props.label.checkboxMenuList[0],
            checkedListAll:this.props.label.checkboxMenuList[0],
            indeterminate:true,
            checkAll: true,
            selectEventStatus:false,
            checkEventIndex:0
        }
    }
    componentDidMount() {
        this.props.actions.addNullTemplate({
            eventTemplateId:this.props.label.eventTemplateId
        })
    }
    modelSelect=(e)=>{
        this.setState({
            selectEventStatus:false
        })
        if(e.target.value==="event"){
            this.setState({
                selectEventStatus:true
            })
        }else{
            this.props.actions.addNullTemplate({
                eventTemplateId:this.props.label.eventTemplateId
            })

        }
    };
    onChange=(checkedList)=>{
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.checkboxArray.length),
            checkAll: checkedList.length === this.state.checkboxArray.length,
        });
    };
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.state.checkedListAll : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };
    handleChange=(value)=>{
        //根据选中名称去列表名称中查找获取在名称数组中的索引值
        const {label:{menuList}} = this.props;
        let index=null;
        for(let i=0;i<menuList.length;i++){
            if (menuList[i].name === value) {
                index = i;
            }
        }
        this.setState({
            checkEventIndex:index,
            checkboxArray:this.props.label.checkboxMenu[index],
            checkedList:this.props.label.checkboxMenuList[index],
            checkedListAll:this.props.label.checkboxMenuList[index],
        })
    };
    hidePopover=()=>{
        this.props.isClose(false)
    };
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                //添加空白模板
                const nullTemplateArr = [];
                const nullTemplateInsertEvent={事件名称:values.nickname};
                for(let keys in this.props.label.nullTemplate) {
                    if (keys !== "事件名称"){
                        nullTemplateArr.push({name:keys,value:this.props.label.nullTemplate[keys],key:keys+"eventDataList"});
                        // nullTemplateInsertEvent.push({keys:this.props.label.nullTemplate[keys]})
                        nullTemplateInsertEvent[keys]=this.props.label.nullTemplate[keys]
                    }
                }
                if(this.state.selectEventStatus==false){
                    this.props.label.menuList.push({
                        name:values.nickname,
                        key:Math.random()
                    });
                    let datas = JSON.parse(this.props.label.menuDataList);
                    datas.push(nullTemplateArr);
                    let datass = JSON.stringify(datas);
                    this.props.actions.changeDataMenuList(datass);
                    this.props.actions.insertEvent({
                        resourceId:this.props.label.resourceId,
                        eventTemplateId:this.props.label.eventTemplateId,
                        event:nullTemplateInsertEvent
                    })
                }else{
                //    添加已有事件模板
                    let checkedListArr = [];
                    let templateArr={事件名称:values.nickname};

                    for(let keys in this.props.label.nullTemplate) {
                        if (keys !== "事件名称"){
                            checkedListArr.push({name:keys,value:this.props.label.nullTemplate[keys],key:keys+"eventDataList"});
                            templateArr[keys]=this.props.label.nullTemplate[keys]
                        }

                    }
                    const menuDataList= JSON.parse(this.props.label.menuDataList)[this.state.checkEventIndex];
                    this.state.checkedList.map((item)=>{
                        menuDataList.map((items,keys)=>{
                            if(items.name===item){
                                checkedListArr[keys].value = items.value
                                templateArr[item]=items.value
                            }
                        })
                    });
                    this.props.actions.insertEvent({
                        resourceId:this.props.label.resourceId,
                        eventTemplateId:this.props.label.eventTemplateId,
                        event:templateArr
                    })
                }
                this.props.isClose(false);
                // console.log(this.props.label.addEventStatus)
                if(this.props.label.addEventStatus===true){
                    message.success('添加成功');
                }
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {label:{menuList,checkboxMenu,checkboxMenuList}} = this.props;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit} hideRequiredMark={true}>
                <FormItem
                    label="事件名称"
                >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: '此项为必填' }],
                    })(
                        <Input placeholder="必填"/>
                    )}
                </FormItem>
                <FormItem

                    label="模板选择"
                >
                    {getFieldDecorator('radioType', {
                        rules: [{ required: true, message: '此项为必填' }],
                    })(
                        <RadioGroup  onChange={this.modelSelect}>
                            <Radio value="null" style={{fontSize:"12px"}}>空白模板</Radio>
                            <Radio value="event" style={{fontSize:"12px"}}>使用已有事件为模板</Radio>
                        </RadioGroup>
                    )}

                </FormItem>
                <FormItem
                    style={{display:this.state.selectEventStatus?"block":"none"}}
                    label="事件选择："
                >
                        <Select defaultValue={menuList[0].name} style={{ width: 120 }} getPopupContainer={trigger => trigger.parentNode}onChange={this.handleChange}>
                            {
                                menuList.map((item,index)=>(
                                    <Option value={item.name} key={index}>{item.name}</Option>
                                ))
                            }
                        </Select>
                </FormItem>
                <FormItem
                    style={{display:this.state.selectEventStatus?"block":"none"}}
                    label="引用数值："
                    className="checkboxListPar"
                >
                    <div className="checkboxList">
                        <Checkbox
                            indeterminate={this.state.indeterminate}
                            checked={this.state.checkAll}
                            onChange={this.onCheckAllChange}
                        >
                            Check all
                        </Checkbox>
                        <div style={{width:290}}>
                            <CheckboxGroup onChange={this.onChange} options={this.state.checkboxArray} value={this.state.checkedList}/>
                        </div>
                    </div>


                </FormItem>
                <FormItem >
                    <div style={{textAlign:"right",width:"320px"}}>
                        <Button style={{marginRight:"8px"}} onClick={this.hidePopover}>取消</Button>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </div>

                </FormItem>

            </Form>
        );
    }
}

const FormEvent = Form.create()(HorizontalLoginForm);

export default FormEvent;