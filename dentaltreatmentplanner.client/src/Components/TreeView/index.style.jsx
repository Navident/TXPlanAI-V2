import styled from 'styled-components';

export const StyledTreeNodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 0;
`;

export const StyledTreeNodeIcon = styled.div`
  cursor: pointer;
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
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
  margin-left: 25px;
  margin-top: -5px;
`;

export const StyledTreeNodeLabelContainer = styled.div`
  display:flex;
  flex-direction:row;
  align-items:center;
`;

export const StyledTreeViewContainer = styled.div`
    margin: 0 auto;
`;