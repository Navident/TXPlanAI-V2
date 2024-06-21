import { useState, useRef, useEffect } from 'react';
import { StyledTreeNodeContainer, StyledTreeViewContainer, StyledDeleteButton, StyledTreeNodeIcon, StyledTreeNodeChildren, StyledTreeNodeLabelContainer } from './index.style';
import StandardTextField from '../../Components/Common/StandardTextfield/StandardTextfield';
import { UI_COLORS } from '../../Theme';
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";

import { useSelector, useDispatch } from 'react-redux';

const TreeView = ({ addParentNode, addButtonText, selector, setTreeData, setExpandedNodes, deleteNodeAction }) => {
    const dispatch = useDispatch();
    const { treeData, expandedNodes } = useSelector(selector);

    const handleAddParentNode = () => {
        addParentNode();
        const newExpandedNodes = [
            ...expandedNodes,
            String(treeData.length)
        ];
        const childrenPaths = treeData[treeData.length]?.children?.map((_, index) => `${treeData.length}-${index}`) || [];
        dispatch(setExpandedNodes([...newExpandedNodes, ...childrenPaths]));
    };

    return (
        <StyledTreeViewContainer>
            {treeData.map((node, index) => (
                <TreeNode
                    key={index}
                    node={node}
                    nodeIndex={index}
                    selector={selector}
                    setTreeData={setTreeData}
                    expandedNodes={expandedNodes}
                    setExpandedNodes={setExpandedNodes}
                    deleteNodeAction={deleteNodeAction}
                    parentPath={[]}
                />
            ))}
            <RoundedButton
                text={addButtonText}
                onClick={handleAddParentNode}
                backgroundColor={UI_COLORS.light_grey2}
                textColor="white"
                border={false}
                borderRadius="4px"
                height="39px"
                width="fit-content"
            />
        </StyledTreeViewContainer>
    );
};





const TreeNode = ({ node, nodeIndex, selector, setTreeData, expandedNodes, setExpandedNodes, deleteNodeAction, parentPath }) => {
    const dispatch = useDispatch();
    const treeData = useSelector(selector).treeData;
    const currentPath = [...parentPath, nodeIndex];
    const pathString = currentPath.join('-');
    const isOpen = expandedNodes.includes(pathString);
    const [value, setValue] = useState(node.value || '');
    const [height, setHeight] = useState(isOpen ? 'auto' : '0px');
    const contentRef = useRef(null);

    const handleTextFieldChange = (event) => {
        setValue(event.target.value);
        const newData = updateTreeData(treeData, currentPath, event.target.value);
        dispatch(setTreeData(newData));
    };

    const handleDeleteNode = () => {
        console.log('Deleting node at path:', currentPath);
        dispatch(deleteNodeAction(currentPath));
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

    const toggleNode = () => {
        const newExpandedNodes = isOpen
            ? expandedNodes.filter(id => id !== pathString)
            : [...expandedNodes, pathString];
        dispatch(setExpandedNodes(newExpandedNodes));
    };

    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                setHeight(`${contentRef.current.scrollHeight}px`);
            } else {
                setHeight('0px');
            }
        }
    }, [isOpen]);

    return (
        <StyledTreeNodeContainer>
            <StyledTreeNodeLabelContainer>
                <StyledTreeNodeIcon onClick={toggleNode}>
                    {hasChildren && (isOpen ? '-' : '+')}
                </StyledTreeNodeIcon>
                <div style={{ marginRight: '8px' }}>{node.label}:</div>
                <StandardTextField
                    label=""
                    value={value}
                    onChange={handleTextFieldChange}
                    borderColor="#ccc"
                    width="350px"
                />
                {parentPath.length === 0 && (
                    <StyledDeleteButton onClick={handleDeleteNode}>x</StyledDeleteButton>
                )}
            </StyledTreeNodeLabelContainer>
            {hasChildren && (
                <StyledTreeNodeChildren
                    ref={contentRef}
                    style={{
                        height,
                        overflow: 'hidden',
                        transition: 'height 0.3s ease-out'
                    }}
                >
                    {node.children.map((child, index) => (
                        <TreeNode
                            key={index}
                            node={child}
                            nodeIndex={index}
                            selector={selector}
                            setTreeData={setTreeData}
                            expandedNodes={expandedNodes}
                            setExpandedNodes={setExpandedNodes}
                            deleteNodeAction={deleteNodeAction}
                            parentPath={currentPath}
                        />
                    ))}
                </StyledTreeNodeChildren>
            )}
        </StyledTreeNodeContainer>
    );
};

export default TreeView;
