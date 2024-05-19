import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const startRecording = createAsyncThunk(
    'audioRecorder/startRecording',
    async (_, { rejectWithValue }) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            return { stream, mediaRecorder };
        } catch (error) {
            return rejectWithValue('Failed to access microphone');
        }
    }
);

const audioRecorderSlice = createSlice({
    name: 'audioRecorder',
    initialState: {
        stream: null,
        mediaRecorder: null,
        recording: false,
        audioFile: null,
        processAudioCallback: null,
        error: null,
    },
    reducers: {
        setProcessAudioCallback(state, action) {
            state.processAudioCallback = action.payload;
        },
        stopRecording(state) {
            if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
                state.mediaRecorder.stop();
                state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
                if (state.audioFile && state.processAudioCallback) {
                    state.processAudioCallback(state.audioFile);
                }
            }
            state.recording = false;
            state.stream = null;
            state.mediaRecorder = null;
            state.audioFile = null;
        },
        resetError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startRecording.fulfilled, (state, action) => {
                state.stream = action.payload.stream;
                state.mediaRecorder = action.payload.mediaRecorder;
                state.recording = true;
                state.error = null;
                action.payload.mediaRecorder.ondataavailable = (event) => {
                    state.audioFile = new File([event.data], "audio.webm", { type: 'audio/webm' });
                };
            })
            .addCase(startRecording.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { stopRecording, setProcessAudioCallback, resetError } = audioRecorderSlice.actions;
export default audioRecorderSlice.reducer;
