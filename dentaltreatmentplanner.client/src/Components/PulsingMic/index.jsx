import './index.style.css';
import MicIcon from '@mui/icons-material/Mic';

function PulsingMic({ stopRecording }) {
    const handleClick = () => {
        console.log("Stopping recording...");
        stopRecording();
    };

    return (
        <div className="container">
            <button id="speech" className="btn type2" onClick={handleClick}>
                <div className="pulse-ring"></div>
                <MicIcon style={{ width: '27px', height: 'auto' }} />
            </button>
        </div>
    );
}

export default PulsingMic;
