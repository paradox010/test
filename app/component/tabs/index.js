import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

const WrapTabs = ({tabList, currentTab, tabOnChange, style,className}) => {
    return (
        <Tabs activeKey={currentTab} className={className} style={{width: '100%',textAlign: 'center', ...style}} onChange={tabOnChange}>
            {
                tabList.map(tab=><TabPane tab={tab.name} key={tab.key}></TabPane>)
            }
        </Tabs>
    )
}

export default WrapTabs
