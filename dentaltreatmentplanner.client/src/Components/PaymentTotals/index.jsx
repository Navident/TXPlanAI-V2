import {
    StyledTotalsContainer, 
    StyledVerticalDivider
} from "./index.style";

const PaymentTotals = ({ ucrTotal, coPayTotal, isGrandTotal = false, justifyContent = "center", marginTop = "0px" }) => {
    const ucrLabel = isGrandTotal ? "Grand UCR Total" : "UCR Total";
    const coPayLabel = isGrandTotal ? "Grand Co-pay Total" : "Co-pay Total";

    return (
        <StyledTotalsContainer justifyContent={justifyContent} marginTop={marginTop}>
            <>
                {ucrLabel}: ${ucrTotal.toFixed(2)}
            </>
            <StyledVerticalDivider />
            <>
                {coPayLabel}: ${coPayTotal.toFixed(2)}
            </>
        </StyledTotalsContainer>
    );
};


export default PaymentTotals;