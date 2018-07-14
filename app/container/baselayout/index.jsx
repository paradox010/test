import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {Header, Content, Footer} = Layout;
import {Link} from 'react-router-dom';

import './index.css'

export default class BaseLayout extends React.PureComponent{
    constructor(props){
        super(props)

        this.prveMenuKey = null;

        this.handleMenuChange = this.handleMenuChange.bind(this);
    }

    handleMenuChange(arg){
        if(arg.key !== this.prveMenuKey){
            this.props.history.push(`/${arg.key.split('_').join('/')}`)
        }
    }

    render(){
        const {children,location: { pathname },match} = this.props;
        const pathArr = pathname.split('/');
        
        //兼容有子页面路由
        const splitPathArr = pathArr.length > 2?pathArr.slice(1,3):pathArr.slice(1);
        let currentMenuKey = splitPathArr.join('_');
        if (currentMenuKey === 'supermind') {
            currentMenuKey = 'supermind_type';
        }
        this.prveMenuKey = currentMenuKey;
        return (
            <Layout style={{
                    height: '100%'
                }}>
                <Header>
                    <div className="baselayout-logo" />
                    <Menu theme="dark" mode="horizontal" onClick={this.handleMenuChange}
                        selectedKeys={[currentMenuKey]}
                        style={{
                            marginLeft:50,
                            float: 'left'
                        }}
                    >
                        <Menu.Item key="domain">
                            <div className='baselayout-header-li'>
                                <Icon type="folder" />
                                <span>
                                    项目管理
                                </span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="supermind_type">
                            <div className='baselayout-header-li'>
                                <Icon type="appstore-o" />
                                <span>
                                    类型管理
                                </span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="supermind_graph">
                            <div className='baselayout-header-li'>
                                <Icon type="share-alt" />
                                <span>
                                    知识图谱
                                </span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="supermind_data">
                            <div className='baselayout-header-li'>
                                <Icon type="api" />
                                <span>
                                    数据融合
                                </span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="supermind_repair">
                            <div className='baselayout-header-li'>
                                <Icon type="usergroup-delete" />
                                <span>
                                    人工纠错
                                </span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="supermind_user">
                            <div className='baselayout-header-li'>
                                <Icon type="team" />
                                <span>
                                    账号管理
                                </span>
                            </div>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content
                    className='baselayout-content'
                >
                    {children}
                </Content>
            </Layout>
        )
    }
}
