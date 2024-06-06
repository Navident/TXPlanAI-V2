import styled from 'styled-components'


export const StyledTextfieldArea = styled.textarea`
    font-family: inherit;
    font-size: inherit;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    resize: vertical;

    &:focus {
        border-color: #7777a1;
        outline: none;
    }

    &:hover {
        border-color: #7777a1;
    }

    /* Style the placeholder text */
    &::placeholder {
        color: #bdbdbd; 
        opacity: 1; 
    }
`;

export const StyledTextfieldWrap = styled.div`
    position: relative;
    flex: 1;
    width: 100%;
`;
