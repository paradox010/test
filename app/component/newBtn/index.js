import { Button } from 'antd';

/**
@param type  4种类型  A 默认 正常primary
                     B  large  primary
                     C  normal  primary

*/

const NewBtn = ({text, type, style, ...allProps}) => {
    const newProps = {
        type: 'primary',
        style: {
            ...style,
            background: '#7FA6F1',
            borderColor: '#7FA6F1',
            width: 104,
            height: 32,
            fontSize: 16,
            color: '#FFFFFF',
            border: 'none'
        }
    };
    if (type === 'B'){
        newProps.style.width = 154;
        newProps.style.boxShadow = '0px 0px 8px 0px rgba(57,98,178,0.24)';
    }else if(type === 'C') {
        delete newProps.type;
        newProps.style.color = '#9B9B9B';
        newProps.style.background = '#FCFCFC';
        newProps.style.border = '1px solid #CCCCCC';
    }else if(type === 'D'){
        delete newProps.style.width;
        newProps.style.padding = '0 12px';
        newProps.style.color = '#7FA6F1';
        newProps.style.fontSize = 12;
        newProps.style.background = 'rgba(252,252,252,1)';
        newProps.style.border = '1px solid #7FA6F1';
    }
    return <Button {...newProps} {...allProps}>{text}</Button>
}

export default NewBtn
