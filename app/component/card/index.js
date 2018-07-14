import './index.css';

const Card = ({title, body, bodyStyle,divStyle}) => {
    return (
        <div className='com-card-body'>
            <div style={bodyStyle} className={divStyle}>{body}</div>
        </div>
    )
}

export default Card
