import { Row, Col } from 'antd';
import './index.css';

const PageContainer = ({areaLeft,areaRight}) => (
    <div className='sp-flex-box' style={{
        flex: 1,
        height:'100%'
    }}>
        <div style={{
            width: 380,
            background: '#F4F5F9'
        }}>
            {areaLeft}
        </div>
        <div style={{
            width: 4,
            background: '#EBECEE'
        }}>

        </div>
        <div style={{
            'flex': 1,
             background:'#FCFCFC',
            flexDirection: 'column',
            height: '100%'
        }}>
            {areaRight}
        </div>
    </div>

)

export default PageContainer
{/* <Row gutter={16} >
    <Col md={6} lg={6} xl={5} className='sm-main-area-left'>
        {areaLeft}
    </Col>
    <Col md={18} lg={18} xl={19} className='sm-main-area-right'>
        {areaRight}
    </Col>
</Row> */}
