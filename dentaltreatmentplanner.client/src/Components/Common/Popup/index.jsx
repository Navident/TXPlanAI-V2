
// Popup.js
// Popup.js
const Popup = ({ children, isVisible, style }) => {
    if (!isVisible) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '100%', // positions the popup just below the icon
            left: '0',
            border: '1px solid black',
            padding: '10px',
            backgroundColor: 'white',
            zIndex: 1000, // ensures the popup is above other content
            ...style
        }}>
            {children}
        </div>
    );
};





export default Popup;
