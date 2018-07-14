import styles from './index.css';
import IMG from '../../static/images/404.png';
import {Link} from 'react-router-dom';
const NoDomain = () => {
    return (
        <div className='error_content'>
            <div className='error_left' ><img src={IMG} /></div>
            <div className='error_right'>
                <div className='error_right_top'>未选择领域</div>
                <div>点击跳转到领域选择</div>
                <Link to='/domain'>
                  <div className='error_right_btn'>跳转</div>
                </Link>
            </div>
        </div>
    )
}

export default NoDomain
