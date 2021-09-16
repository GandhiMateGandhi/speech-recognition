import './App.scss';
import 'antd/dist/antd.css'
import Main from "./components/Main";

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition2 = new SpeechRecognition();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();

recognition.lang = 'ru-RU';
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 5;

recognition.onspeechend = () => {
    recognition.stop();
};

function App() {
    return (
        <div className="App">
            {/*<button onClick={() => recognition2.start()}>start</button>*/}
            {/*<button onClick={() => recognition2.stop()}>stop</button>*/}
            <Main recognition={recognition}/>
        </div>
    );
}

export default App;
