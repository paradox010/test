import {Icon,message,Modal,Button,Popconfirm,Tooltip} from 'antd';
import "./label.css"


export default class EventList extends React.Component{
    constructor(args){
        super(args);
        this.state={
            expandStatus: 0,
            selectInputKeys:null,
            // menuData:this.props.menuData,
            // eventDetailData:this.props.eventDetailData,
            // dataTabList:this.props.dataTabList,         
            
            menuData: [
                {name: "张含韵", "email": "zhang@email.com", key: '11111', value: ['34']},
                {name: "江一燕",   "email": "jiang@email.com", key: '22222', value: ['454']},
                {name: "李小璐",  "email": "li@email.com", key: '333333', value: ['990']}
            ],
            eventDetailData: [
                [
                    {name: "张含韵", "email": "zhang@email.com", key: '1118', value: []},
                    {name: "张含韵", "email": "zhang@email.com", key: '1110', value: ['subItem']},
                    {name: "张含韵", "email": "zhang@email.com", key: 'l', value: ['dfd']},
                ],
                [
                    {name: "江一燕",   "email": "jiang@email.com", key: 'h', value: ['dfd']},
                    {name: "江一燕",   "email": "jiang@email.com", key: '222k', value: ['dfd']},
                    {name: "江一燕",   "email": "jiang@email.com", key: 'm', value: ['dfd']},
                ],
                [
                    {name: "李小璐",  "email": "li@email.com", key: 'j333', value: ['dfd']},
                    {name: "李小璐",  "email": "li@email.com", key: '33k3', value: ['dfd']},
                    {name: "李小璐",  "email": "li@email.com", key: 'ui333', value: ['dfd']},
                ]
            ],
            dataTabList: [[{dataTab: '2232'}],[{dataTab: '3434'}],[{dataTab: '3434'}]],
            inputEdit:false,
            inputId:null,
            exStatus:true,
            visible: false
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    expandMenu=(item, index)=>{   
        let complateStatus=null;
        let list = this.state.eventDetailData[index];
        let flag = this.filterForm(item)       
        
        if(this.state.expandStatus === index) {
            this.state.expandStatus = false;                        
        }else{     
            this.state.expandStatus = index;       
        }    
    };
    confirmLayout=(index)=>{
        let self = this;
        Modal.confirm({
            content: '确认放弃当前面板~',
            okText: '确认',
            cancelText: '取消',            
            onOk: function(){                               
                console.log('确认小狗');
            },
            onCancel: function() {
                console.log('取消效果');
            }
        });
    }
    filterForm=(item)=>{
        let flag = true;
        if(!item.value || !item.value[0]) {
            flag = false;
        }        

        return flag;

    }
    hideEdit=()=>{        
        this.setState({
            selectInputKeys:null,
        })            
    }
    focusEvent=(e)=>{
        e.stopPropagation();
        if(e.target.getAttribute('tabs')!==""){
            const tabInfo = e.target.getAttribute('tabs').split("=")[1];
            this.props.getIndex(tabInfo)
        }else{
            this.props.getIndex("")
        }
        this.setState({
            selectInputKeys:e.target.name,
            inputEdit:true,
            inputId:e.target.id
        })
    };
    resetInput=(event,menuListArrIndex,listIndex)=>{
        event.target.previousSibling.value = this.state.eventDetailData[menuListArrIndex][listIndex].value;
    }
    deleteEvent=(e)=>{
        e.stopPropagation();
    };
    cancelDelete=(e)=>{
        e.stopPropagation();
    };
    confirmDelete=(e,value)=>{
        e.stopPropagation();
        this.props.deleteEvent(value);
    };
    componentWillReceiveProps(nextProps){
        if( nextProps.selectInputId!==null && document.getElementById(nextProps.selectInputId)!==null && this.state.inputEdit===false){
            document.getElementById(nextProps.selectInputId).value=nextProps.inputText
            this.setState({
                selectInputKeys:nextProps.selectInputKeys,
            })
        }
        if(this.state.inputEdit===true){
            document.getElementById(this.state.inputId).value=nextProps.inputText
        }
        this.setState({
            menuData:nextProps.menuData,
            eventDetailData:nextProps.eventDetailData,
            dataTabList:nextProps.dataTabList,
            addStatus: nextProps.addStatus
            // expandStatus:nextProps.selectKey,            
            // selectInputKeys:nextProps.selectInputKeys
        })
    };
    getProgress = (list) => {
        let count = 0;
        list.map((item, index)=>{
            if(!item.value || item.value[0]) {
                count++
            }
        })
        return count;
    }
    //取消事件保存
    cancelEventList=(e, index, id)=> {
        message.info('取消成功~')
        this.setState({            
            expandStatus: false
        })
    }
    //保存事件列表
    saveEventList=(e,index,id)=>{
        const eventSelectData = [...this.props.eventDetailData[index]];
        const inputValueArr = e.target.parentNode.parentNode.getElementsByClassName("inputsValue");
        let inputArr = {};
        for(let i=0;i<inputValueArr.length;i++){
            if(typeof eventSelectData[i].value==="string" && eventSelectData[i].value!==inputValueArr[i].value){
                inputArr[eventSelectData[i].name]=inputValueArr[i].value
            }else if(eventSelectData[i].value instanceof Array&& eventSelectData[i].value.join("")!==inputValueArr[i].value ){
                inputArr[eventSelectData[i].name]=[inputValueArr[i].value]
            }
        }
        message.info('保存成功~')
        this.setState({            
            expandStatus: false
        })

        this.props.update({
            eventId:id,
            event:inputArr,
            eventList: eventSelectData
        });
    }
    
    render(){
        let menuData = this.state.menuData;
        
        return(
            <ul className="menuList"  onClick={this.hideEdit}>
                {
                    this.state.menuData.map((item,index)=>(
                            <li key={item.key}  className={this.state.expandStatus===index?"menuListSelected":"menuListLi"} style={{height:this.state.expandStatus===index?"93%":"48px"}}>
                            
                                <div className={this.state.expandStatus===index?"menuTitleSelect menuTitle":"menuTitle"}  onClick={()=>{this.expandMenu(item, index)}}><Icon type="caret-down"  style={{marginRight:"12px",float:"left",marginTop:"15px"}}/><Tooltip title={item.name}><span style={{display:"inline-block",width:"231px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</span></Tooltip>
                                    <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onCancel={this.cancelDelete} onConfirm={(e,eventid)=>this.confirmDelete(e,item.eventId)}>
                                        <Icon type="delete" style={{float:"right",marginTop:"15px"}} onClick={this.deleteEvent}/>
                                    </Popconfirm>
                                </div>
                                
                                    <ul className="editArea"  style={{display:this.state.expandStatus===index?"block":"none",overflowY:"auto"}}>
                                        {
                                            this.state.eventDetailData[index].map((items,indexs)=>(
                                                // "inputsList"
                                                <li key={items.key} className={this.state.selectInputKeys===items.key?"inputsList":""}>
                                                    <label htmlFor={indexs+"_"+index}>{items.name+"："}</label>
                                                    {
                                                        items.value!==""&& items.value.length!==0?<Tooltip placement="top" title={items.value}>
                                                            <div className={this.state.selectInputKeys===items.key?"inputAreaSelect inputArea":"inputArea"}>
                                                                    <input type="text" id={indexs+"_"+index} className="inputsValue" defaultValue={items.value} name={items.key} tabs={indexs<this.state.dataTabList[index].length?this.state.dataTabList[index][indexs].dataTab:null}   onFocus={this.focusEvent} onClick={this.focusEvent}  /><Icon type="sync"  onClick={(e,menulistArrindex,listIndex)=>this.resetInput(e,index,indexs)} style={{cursor:"pointer"}}/>
                                                            </div>
                                                        </Tooltip>: <div className={this.state.selectInputKeys===items.key?"inputAreaSelect inputArea":"inputArea"}>
                                                                <input type="text" id={indexs+"_"+index} className="inputsValue" defaultValue={items.value} name={items.key} tabs={indexs<this.state.dataTabList[index].length?this.state.dataTabList[index][indexs].dataTab:null} onFocus={this.focusEvent} onClick={this.focusEvent}  /><Icon type="sync" onClick={(e,menulistArrindex,listIndex)=>this.resetInput(e,index,indexs)} style={{cursor:"pointer"}}/>
                                                        </div>
                                                    }
                                                </li>
                                            ))
                                        }

                                    </ul>
                                    <div style={{height:"89px",lineHeight:"89px",marginRight:"32px",textAlign:'right',display:this.state.expandStatus===index?"block":"none"}}>
                                        <Button type="default" style={{marginRight: "12px"}} onClick={(e,indexValue,id)=>this.cancelEventList(e,index,item.eventId)}>取消</Button>
                                        <Button type="primary" onClick={(e,indexValue,id)=>this.saveEventList(e,index,item.eventId)}>保存</Button>
                                    </div>
                                    
                               
                            </li>
                            
                    ))
                }
                {/*<button onClick={this.removeSelectName}>ddd</button>*/}
            </ul>
        )
    }
}
