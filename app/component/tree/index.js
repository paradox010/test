import { Tree, Icon, Popover, Popconfirm  } from 'antd';
const TreeNode = Tree.TreeNode;
import './index.css';

const renderTreeNodesTitle = (title, hasTitleBtn ,operateRender, info) => {
    if (hasTitleBtn) {
        return (
            <span>
                <span className='wt-tree-title-left'>{title}</span>
                <span className='wt-tree-title-right'>{operateRender?operateRender.map(opt=>{
                    if (!!opt.popconfirm) {
                        const {title, placement, onConfirm} = opt.popconfirm
                        return (
                            <Popconfirm key={opt.key} title={title} placement={placement || "right"}  okText="确定" cancelText="取消" onConfirm={e=>{e.stopPropagation();onConfirm(info)}} >
                                <Icon type={opt.icon} style={opt.style} onClick={e=>{e.stopPropagation()}} />
                            </Popconfirm>
                        )
                    }
                    return <Icon key={opt.key} type={opt.icon} style={opt.style} onClick={(e)=>{e.stopPropagation();opt.onConfirm(info)}}/>
                }):null}</span>
            </span>
        )
    }
    return title
}

const entityTreeOnLoadData = (treeNode, onLoadAction, treeData) => {
    return new Promise((resolve) => {
        if (treeNode.props.children) {
            resolve();
            return;
        }
        onLoadAction({treeNode,newTreeData:treeData});
        resolve();
    })
}

const renderTreeNodes = (data, operateRender) => {
    return data.map((item) => {
        const isOutside = item.key.split('-').length === 1;
        const treeClass = isOutside?'wt-wrap-class-outside':'wt-wrap-class';
        if (item.children) {
            return (
                <TreeNode {...item} key={item.key} title={renderTreeNodesTitle(item.title, item.hasTitleBtn, operateRender, item)} nodeValue={item.value} dataRef={item} className={treeClass}>
                    {renderTreeNodes(item.children, operateRender)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} key={item.key} title={renderTreeNodesTitle(item.title, item.hasTitleBtn, operateRender, item)} nodeValue={item.value} dataRef={item} className={treeClass} />;
    });
}

const WrapTree = ({treeData, onSelect, selectedKeys, operateRender=null, onLoadAction, multiple=false}) => {
    // onSelect 点击树节点触发
    // selectedKeys（受控）设置选中的树节点
    // loadData 异步加载数据
    // multiple 支持点选多个节点（节点本身）
    return (
        <Tree
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            loadData={onLoadAction?(treeNode)=>entityTreeOnLoadData(treeNode, onLoadAction, treeData):null}
            multiple={multiple}

        >
            {renderTreeNodes(treeData, operateRender)}
        </Tree>
    )
}

export default WrapTree
