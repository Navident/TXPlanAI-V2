import styled from 'styled-components';

export const StyledTreeNodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
`;

export const StyledTreeNodeIcon = styled.div`
  cursor: pointer;
  display: inline-flex; // Use flex to center content inside the label
  align-items: center; // Center content vertically inside the label
  justify-content: center; // Center content horizontally
  margin-right: 8px;
  padding: 5px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background-color: #ccc;
  color: black;
  user-select: none;
`;

export const StyledTreeNodeChildren = styled.div`
  margin-left: 20px;
`;

export const StyledTreeNodeLabelContainer = styled.div`
  display:flex;
  flex-direction:row;
  align-items:center;
`;
