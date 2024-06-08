export const addNewNodeAndExpand = (treeData, expandedNodes, createNode) => {
    const newNodeIndex = treeData.length;
    const newNodePath = `${newNodeIndex}`;
    const newNode = createNode({}, newNodeIndex);

    const newTreeData = [...treeData, newNode];
    const newExpandedNodes = [
        ...expandedNodes,
        newNodePath,
        ...newNode.children.map((_, index) => `${newNodePath}-${index}`)
    ];

    return { newTreeData, newExpandedNodes };
};
