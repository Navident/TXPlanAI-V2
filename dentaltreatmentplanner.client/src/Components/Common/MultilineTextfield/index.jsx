import {
    StyledTextfieldArea
} from "./index.style";

const MultiLineTextfield = ({ label, value, onChange, placeholder }) => {
    // Example multiline placeholder
    const multilinePlaceholder = placeholder || "#3 MOD composite\n#5 RCT, build up, post, porcelain crown\n#6-11 pfm bridge\n#22-24 extraction, bone graft, membrane, implant bridge, porcelain crowns";

    return (
        <StyledTextfieldArea
            value={value}
            onChange={onChange}
            rows={5} // minRows equivalent
            placeholder={multilinePlaceholder} 
        />
    );
};

export default MultiLineTextfield;