import './index.style.css';
import MicIcon from '@mui/icons-material/Mic';
function PulsingMic({ stopRecording }) {
    return (
        <div className="container">
            <button id="speech" className="btn type2" onClick={stopRecording}>
                <div className="pulse-ring"></div>
                <MicIcon />
            </button>
        </div>
    );
}

export default PulsingMic;
