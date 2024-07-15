import {
    StyledTotalsContainer,
    StyledVerticalDivider
} from "./index.style";

const PaymentTotals = ({ total = 0, isGrandTotal = false, justifyContent = "center", marginTop = "0px" }) => {
    const label = isGrandTotal ? "Grand Total" : "Total";

    return (
        <StyledTotalsContainer justifyContent={justifyContent} marginTop={marginTop}>
            <>
                {label}: ${total.toFixed(2)}
            </>
        </StyledTotalsContainer>
    );
};

export default PaymentTotals;
