import styled from 'styled-components';

export const StyledNotesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Adjust the gap between items as needed */
`;

export const StyledNote = styled.div`
    flex: 1 1 calc(50% - 20px); 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 8px; 
   
    box-sizing: border-box;
`;