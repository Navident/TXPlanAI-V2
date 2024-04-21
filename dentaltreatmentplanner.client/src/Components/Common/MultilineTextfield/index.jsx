import MicIcon from '@mui/icons-material/Mic';
import { StyledTextfieldArea, StyledTextfieldWrap } from "./index.style";

const MultiLineTextfield = ({ label, value, onChange, placeholder, onMicClick }) => {
    const multilinePlaceholder = placeholder || "#3 MOD composite\n#5 RCT, build up, post, porcelain crown\n#6-11 pfm bridge\n#22-24 extraction, bone graft, membrane, implant bridge, porcelain crowns";

    return (
        <StyledTextfieldWrap>
            <StyledTextfieldArea
                value={value}
                onChange={onChange}
                rows={5}
                placeholder={multilinePlaceholder}
            />
            <MicIcon
                onClick={onMicClick}
                style={{
                    position: 'absolute',
                    bottom: '-24px',
                    left: '0px',
                    cursor: 'pointer',
                    width: '27px',
                    height: 'auto'
                }}
            />
        </StyledTextfieldWrap>
    );
};

export default MultiLineTextfield;
