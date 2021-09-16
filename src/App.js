import './App.scss';
import 'antd/dist/antd.css'
import Main from "./components/Main";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {useState} from "react";

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition2 = new SpeechRecognition();

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
// const recognition = new SpeechRecognition();
//
// recognition.lang = 'ru-RU';
// recognition.continuous = true;
// recognition.interimResults = true;
// recognition.maxAlternatives = 5;
//
// let recognitionTextResult = '';


function App() {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening
    } = useSpeechRecognition();

    const startListening = () => {
        return SpeechRecognition.startListening({
            continuous: true,
            language: 'ru-RU'
        })
    }

    const [arr, setArr] = useState([])

    const onSetArrClick = () => {
        setArr([...arr, transcript])
    }

    // console.log(arr)

    return (
        <div className="App">
            {/*<div>*/}
            {/*    <p>Microphone: {listening ? 'on' : 'off'}</p>*/}
            {/*    <button onClick={startListening}>Start</button>*/}
            {/*    <button onClick={SpeechRecognition.stopListening}>Stop</button>*/}
            {/*    <button onClick={onSetArrClick}>Set arr</button>*/}
            {/*    <p>{transcript}</p>*/}
            {/*</div>*/}
            {/*<button onClick={() => recognition2.start()}>start</button>*/}
            {/*<button onClick={() => recognition2.stop()}>stop</button>*/}
            <Main />
        </div>
    );
}

export default App;
