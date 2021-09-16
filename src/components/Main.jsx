import React, {useEffect, useState} from 'react';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Layout} from "antd";
import logo from '../img/logo.png'
import SpeechSection from "./SpeechSection";
import ListSection from "./ListSection";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// const recognition = new SpeechRecognition();
const Main = () => {

    const {
        transcript,
        listening,
        resetTranscript,
    } = useSpeechRecognition();

    let getRecognitionList = JSON.parse(localStorage.getItem('recognitionList'))
    let getWhiteList = JSON.parse(localStorage.getItem('whiteList'))
    let getBlackList = JSON.parse(localStorage.getItem('blackList'))
    let recognitionResult = '';
    // const [recognitionResult, setRecognitionResult] = useState('');
    // const [recognitionTranscript, setRecognitionTranscript] = useState('')

    const [isRecognitionStarted, setRecognitionStarted] = useState(false);
    // const [recognitionTextResult, setRecognitionTextResult] = useState([]);
    const [recognitionTextResult, setRecognitionTextResult] = useState([]);
    const [recognitionList, setRecognitionList] = useState(getRecognitionList ? getRecognitionList : []);
    const [isWhiteListActive, setWhiteListActive] = useState(false);
    const [isBlackListActive, setBlackListActive] = useState(false);
    const [whiteList, setWhiteList] = useState(getWhiteList ? getWhiteList : []);
    const [blackList, setBlackList] = useState(getBlackList ? getBlackList : []);
    const [counter, setCounter] = useState(0)


    // recognition.lang = 'ru-RU';
    // recognition.continuous = true;
    // recognition.interimResults = true;
    // recognition.maxAlternatives = 5;

    if (getRecognitionList === null) {
        getRecognitionList = []
    }
    if (getWhiteList === null) {
        getWhiteList = []
    }
    if (getBlackList === null) {
        getBlackList = []
    }

    const onStartRecordClick = () => {
        if (!isRecognitionStarted) {
            // recognition.start();
            setRecognitionStarted(true)
            setCounter(150)

            return SpeechRecognition.startListening({
                continuous: true,
                language: 'ru-RU'
            })
        }
    }


    const onStopRecordClick = () => {
        // const transcriptArray = transcript.split(' ')

        if (isRecognitionStarted) {
            setRecognitionList(prev => [transcript, ...prev])

            SpeechRecognition.abortListening()
            resetTranscript()

            localStorage.setItem('recognitionList', JSON.stringify([transcript, ...recognitionList]))
            setRecognitionStarted(false)
        }
    }

    const onRecognitionStop = () => {
        if (!!recognitionTextResult.length) {
            const filteredTextResult = recognitionTextResult.filter(item => item)
            setRecognitionList(prev => [filteredTextResult, ...prev])

            getRecognitionList.unshift(filteredTextResult)

            if (recognitionList.length > 15) {
                setRecognitionList(prev => {
                    return prev.slice(0, -1)
                })
            }
            localStorage.setItem('recognitionList', JSON.stringify(getRecognitionList))

            // recognitionTextResult = ''
            // setRecognitionTextResult([])
        }
    }

    // recognition.onspeechend = () => {
    //     recognition.stop();
    // };

    // recognition.onresult = (event) => {
    //     let recognitionTranscript = '';
    //
    //     for (let i = event.resultIndex; i < event.results.length; i++) {
    //         let transcript = event.results[i][0].transcript;
    //
    //         if (event.results[i].isFinal) {
    //             const trimmedTranscript = transcript.trim();
    //             const transcriptArray = trimmedTranscript.split(' ');
    //
    //             transcriptArray.forEach(transcript => recognitionResult += ` ${transcript}`);
    //         } else {
    //             recognitionTranscript += transcript;
    //         }
    //     }
    //     // setRecognitionTextResult([...recognitionTextResult, recognitionResult.trim().toLocaleLowerCase(), recognitionTranscript.toLocaleLowerCase()])
    //
    //
    // };
    // console.log(recognitionTextResult)


    // recognition.onerror = (event) => {
    //     recognition.stop();
    //     alert(`произошла ошибка: ${event.error}, пожалуйста, перезагрузите страницу :)`);
    // };


    useEffect(() => {
        // localStorage.setItem('recognitionList', JSON.stringify(recognitionTextResult))
    }, [getRecognitionList])


    useEffect(() => {
        // let isCancelled = false;
        // const runAsync = async () => {
        //     try {
        //         if (isRecognitionStarted) {
        //             counter > 0 && setTimeout(() => !isCancelled && setCounter(counter - 1), 1000);
        //             if (counter === 0) {
        //                 SpeechRecognition.stopListening()
        //                 // recognition.stop();
        //                 onRecognitionStop()
        //                 setRecognitionStarted(false)
        //             }
        //         }
        //     } catch (e) {
        //         if (!isCancelled) {
        //             throw e;
        //         }
        //     }
        // };
        // runAsync();
        // return () => isCancelled = true;
    }, [counter, isRecognitionStarted]);


    const props = {
        onStartRecordClick,
        onStopRecordClick,
        isRecognitionStarted,
        counter,
        setRecognitionTextResult,
        recognitionTextResult,
        getRecognitionList,
        recognitionList,
        whiteList,
        blackList,
        isWhiteListActive,
        setWhiteListActive,
        setWhiteList,
        isBlackListActive,
        setBlackListActive,
        setBlackList,
        getWhiteList,
        getBlackList,
        setRecognitionList,
        transcript
    }

    return (
        <Layout>
            <Header className="header">
                <div className="Logo">
                    <img src={logo} alt="Logo"/>
                </div>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Layout className="Layout">
                    <SpeechSection {...props}/>
                    <ListSection {...props}/>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>Speech Recognition ©2021 Created by TTK Digital</Footer>
        </Layout>
    );
};

export default Main;