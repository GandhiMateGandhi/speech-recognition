import React, {useEffect, useState} from 'react';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Layout} from "antd";
import logo from '../img/logo.png'
import SpeechSection from "./SpeechSection";
import ListSection from "./ListSection";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

const Main = () => {
    const {
        transcript,
        resetTranscript,
    } = useSpeechRecognition();

    let getRecognitionList = JSON.parse(localStorage.getItem('recognitionList'))
    let getWhiteList = JSON.parse(localStorage.getItem('whiteList'))
    let getBlackList = JSON.parse(localStorage.getItem('blackList'))
    let getCounter = JSON.parse(localStorage.getItem('counter'))

    const [isRecognitionStarted, setRecognitionStarted] = useState(false);
    const [recognitionList, setRecognitionList] = useState(getRecognitionList ? getRecognitionList : []);
    const [isWhiteListActive, setWhiteListActive] = useState(false);
    const [isBlackListActive, setBlackListActive] = useState(false);
    const [whiteList, setWhiteList] = useState(getWhiteList ? getWhiteList : []);
    const [blackList, setBlackList] = useState(getBlackList ? getBlackList : []);
    const [counter, setCounter] = useState(getCounter ? getCounter : 20)
    const [isCounterSettingActive, setCounterSettingActive] = useState(false)

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
            setRecognitionStarted(true)
            setCounter(getCounter)

            return SpeechRecognition.startListening({
                continuous: true,
                language: 'ru-RU'
            })
        }
    }


    const onStopRecordClick = () => {
        if (isRecognitionStarted) {
            if (transcript.length > 0) {
                if (recognitionList.length > 15) {
                    setRecognitionList(prev => [transcript, ...prev.slice(0, -1)])
                    localStorage.setItem('recognitionList', JSON.stringify([transcript, ...recognitionList.slice(0, -1)]))
                } else {
                    setRecognitionList(prev => [transcript, ...prev])
                    localStorage.setItem('recognitionList', JSON.stringify([transcript, ...recognitionList]))
                }
            }

            SpeechRecognition.abortListening()
            console.log('stopListening')
            resetTranscript()
            setRecognitionStarted(false)
        }
    }

    // recognition.onerror = (event) => {
    //     recognition.stop();
    //     alert(`произошла ошибка: ${event.error}, пожалуйста, перезагрузите страницу :)`);
    // };

    useEffect(() => {
        let isCancelled = false;
        const runAsync = async () => {
            try {
                if (isRecognitionStarted) {
                    counter > 0 && setTimeout(() => !isCancelled && setCounter(counter - 1), 1000);
                    if (counter === 0) {
                        onStopRecordClick()
                        setRecognitionStarted(false)
                    }
                }
            } catch (e) {
                if (!isCancelled) {
                    throw e;
                }
            }
        };
        runAsync();
        return () => isCancelled = true;
    }, [counter, isRecognitionStarted]);


    const props = {
        onStartRecordClick,
        onStopRecordClick,
        isRecognitionStarted,
        counter,
        recognitionList,
        setRecognitionList,
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
        transcript,
        resetTranscript,
        isCounterSettingActive,
        setCounterSettingActive,
        setCounter
    }

    return (
        <Layout>
            <Header>
                <div className="Logo">
                    <img src={logo} alt="Logo"/>
                </div>
            </Header>
            <Content>
                <Layout className="Layout">
                    <SpeechSection {...props}/>
                    <ListSection {...props}/>
                </Layout>
            </Content>
            <Footer>2021 Kazan Digital Week</Footer>
        </Layout>
    );
};

export default Main;