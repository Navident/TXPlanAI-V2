import { useState } from 'react';
import { StyledTreeNodeContainer, StyledTreeNodeIcon, StyledTreeNodeChildren, StyledTreeNodeLabelContainer } from './index.style';
import StandardTextField from '../../../../../Components/Common/StandardTextfield/StandardTextfield';

import { useSelector, useDispatch } from 'react-redux';

const TreeView = ({ addParentNode, addButtonText, selector, setTreeData }) => {
    const dispatch = useDispatch();
    const { treeData } = useSelector(selector);

    return (
        <div>
            {treeData.map((node, index) => (
                <TreeNode key={index} node={node} nodeIndex={index} selector={selector} setTreeData={setTreeData} />
            ))}
            <button onClick={addParentNode} style={{ marginTop: '10px' }}>
                {addButtonText}
            </button>
        </div>
    );
};

const TreeNode = ({ node, nodeIndex, selector, setTreeData, parentPath = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(node.value || '');
    const dispatch = useDispatch();
    const treeData = useSelector(selector).treeData;
    const currentPath = [...parentPath, nodeIndex];

    const handleTextFieldChange = (event) => {
        setValue(event.target.value);
        const newData = updateTreeData(treeData, currentPath, event.target.value);
        dispatch(setTreeData(newData));
    };

    const updateTreeData = (data, path, newValue) => {
        if (path.length === 1) {
            const updatedNode = { ...data[path[0]], value: newValue };
            return [
                ...data.slice(0, path[0]),
                updatedNode,
                ...data.slice(path[0] + 1)
            ];
        }
        return data.map((node, index) =>
            index === path[0] ? {
                ...node,
                children: updateTreeData(node.children, path.slice(1), newValue)
            } : node
        );
    };

    const hasChildren = node.children && node.children.length > 0;

    return (
        <StyledTreeNodeContainer>
            <StyledTreeNodeLabelContainer>
                <StyledTreeNodeIcon onClick={() => setIsOpen(!isOpen)}>
                    {hasChildren && (isOpen ? '-' : '+')}
                </StyledTreeNodeIcon>
                <div style={{ marginRight: '8px' }}>{node.label}:</div>
                <StandardTextField
                    label=""
                    value={value}
                    onChange={handleTextFieldChange}
                    borderColor="#ccc"
                />
            </StyledTreeNodeLabelContainer>
            {hasChildren && isOpen && (
                <StyledTreeNodeChildren>
                    {node.children.map((child, index) => (
                        <TreeNode
                            key={index}
                            node={child}
                            nodeIndex={index}
                            selector={selector}
                            setTreeData={setTreeData}
                            parentPath={currentPath}
                        />
                    ))}
                </StyledTreeNodeChildren>
            )}
        </StyledTreeNodeContainer>
    );
};

export default TreeView;