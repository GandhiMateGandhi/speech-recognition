import './App.scss';
import 'antd/dist/antd.css'
import Main from "./components/Main";
import {useState} from "react";

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
// const recognition = new SpeechRecognition();

function App() {
    return (
        <div className="App">
            {/*<button onClick={() => recognition.start()}>start</button>*/}
            {/*<button onClick={() => recognition.stop()}>stop</button>*/}
            <Main/>
        </div>
    );
}

export default App;
