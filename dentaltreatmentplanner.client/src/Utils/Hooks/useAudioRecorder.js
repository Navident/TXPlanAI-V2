import { useState, useCallback } from 'react';

const useAudioRecorder = (processAudioFileCallback, setShowAudioPopup) => {
    const [stream, setStream] = useState(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const startRecording = useCallback(() => {
        if (!recording) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(newStream => {
                    setStream(newStream);
                    const recorder = new MediaRecorder(newStream);
                    setMediaRecorder(recorder);
                    recorder.start();
                    setRecording(true);
                    setShowAudioPopup(true);

                    recorder.ondataavailable = async (event) => {
                        if (recorder.state === 'inactive') {
                            const audioFile = new File([event.data], "audio.webm", { type: 'audio/webm' });
                            processAudioFileCallback(audioFile);
                        }
                    };

                    recorder.onstop = () => {
                        console.log("Recording stopped and stream tracks are being stopped.");
                        setRecording(false);
                        newStream.getTracks().forEach(track => track.stop());
                        setStream(null);
                        setShowAudioPopup(false);
                    };
                }).catch(error => {
                    console.error('Error accessing microphone:', error);
                    alert("Failed to access microphone.");
                });
        }
    }, [recording, stream, setShowAudioPopup, processAudioFileCallback]);

    const stopRecording = useCallback(() => {
        console.log("Trying to stop MediaRecorder with state:", mediaRecorder?.state);
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            console.log("Stopping recording...");
            mediaRecorder.stop(); // This should trigger the onstop event
        }
    }, [mediaRecorder]);

    const handleClose = useCallback(() => {
        console.log("Handle close called...");
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.ondataavailable = () => { };
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setRecording(false);
        setShowAudioPopup(false);
    }, [mediaRecorder, stream, setShowAudioPopup]);

    return { startRecording, stopRecording, handleClose, recording };
};

export default useAudioRecorder;
