import {Icon, Popconfirm} from 'antd';

import './index.css';

const Tag = ({label,item,onClick,active,operateRender,info}) => {
    return (
        <li onClick={onClick} className={active?'com-tl-body-ul-li com-tl-body-ul-li-active':'com-tl-body-ul-li'}>
            <span className='com-tl-body-ul-li-span1'>{label}</span>
            <span className='com-tl-body-ul-li-span2'>{operateRender?operateRender.map(opt=>{
                if (!!opt.popconfirm) {
                    const {title, placement, onConfirm} = opt.popconfirm
                    return (
                        <Popconfirm key={opt.key} title={title} placement={placement || "right"}  okText="确定" cancelText="取消" onConfirm={e=>{e.stopPropagation();onConfirm(info)}} >
                            <Icon type={opt.icon} onClick={e=>{e.stopPropagation()}} />
                        </Popconfirm>
                    )
                }
                return <Icon key={opt.key} type={opt.icon} onClick={(e)=>{e.stopPropagation();opt.onConfirm(info)}}/>
            }):null}</span>
        </li>
    )
}



//     (e,id)=>{
//     e.stopPropagation()

// }
const TagList = ({onClick,activeTag,style,data,operateRender}) => {

    const currentTagOnChange = (val, item, index) => {
        if (activeTag !== val) {
            onClick(val, item, index)
        }
    }
    return (
        <div className='com-tl-body' style={style}>
            <ul className='com-tl-body-ul'>
                {
                    data.map((item,k)=><Tag
                        label={item.label}
                        key={item.key}
                        onClick={()=>{currentTagOnChange(item.value, item, k)}}
                        active={item.value===activeTag}
                        info={{value:item.value, label:item.label, index:k}}
                        operateRender={operateRender}
                    />)
                }
            </ul>
        </div>
    )
}

export default TagList
