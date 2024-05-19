import React from 'react';
import AlertDialog from '../Common/PopupAlert';
import PulsingMic from '../PulsingMic';

function AudioPopup({ open, stopRecording, onClose }) {
    return (
        <AlertDialog
            title="Listening..."
            content={
                <div className="mic-text-container">
                    <div>
                        Please say your treatments and click the microphone when your done.
                    </div>
                    <PulsingMic stopRecording={stopRecording} />
                </div>
            }
            open={open}
            onClose={onClose}
            textInput={false}
            showActions={false}  
        />
    );
}

export default AudioPopup;
