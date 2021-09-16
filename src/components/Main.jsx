import React, {useEffect, useState} from 'react';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Layout} from "antd";
import logo from '../img/logo.png'
import SpeechSection from "./SpeechSection";
import ListSection from "./ListSection";

const Main = ({recognition}) => {
    let getRecognitionList = JSON.parse(localStorage.getItem('recognitionList'))
    let getWhiteList = JSON.parse(localStorage.getItem('whiteList'))
    let getBlackList = JSON.parse(localStorage.getItem('blackList'))
    // let recognitionResult = '';
    const [recognitionResult, setRecognitionResult] = useState('');
    const [recognitionTranscript, setRecognitionTranscript] = useState('')

    const [isRecognitionStarted, setRecognitionStarted] = useState(false);
    const [recognitionTextResult, setRecognitionTextResult] = useState([]);
    const [recognitionList, setRecognitionList] = useState(getRecognitionList ? getRecognitionList : []);
    const [isWhiteListActive, setWhiteListActive] = useState(false);
    const [isBlackListActive, setBlackListActive] = useState(false);
    const [whiteList, setWhiteList] = useState(getWhiteList ? getWhiteList : []);
    const [blackList, setBlackList] = useState(getBlackList ? getBlackList : []);
    const [counter, setCounter] = useState(0)

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
            recognition.start();
            setRecognitionStarted(true)
            setCounter(150)
        }
    }

    const onStopRecordClick = () => {
        if (isRecognitionStarted) {
            recognition.stop();
            recognition.addEventListener('end', () => console.log('recognition end'))
            onRecognitionStop()

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

            setRecognitionTextResult([])
        }
    }


    console.log(recognitionTranscript)

    recognition.onresult = (event) => {
        // console.log(event)
        // let recognitionTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                console.log(transcript)
                const trimmedTranscript = transcript.trim();
                const transcriptArray = trimmedTranscript.split(' ');

                console.log(transcriptArray)

                transcriptArray.forEach(transcript => setRecognitionResult(prev => `${prev} ${transcript}`));

            } else {
                // console.log(transcript)
                setRecognitionTranscript(prev => `${prev} ${transcript}`);
            }
        }
        setRecognitionTextResult(prev => [...prev, recognitionResult.trim().toLocaleLowerCase(), recognitionTranscript.trim().toLocaleLowerCase()])

    };

    // recognition.onerror = (event) => {
    //     recognition.stop();
    //     alert(`произошла ошибка: ${event.error}, пожалуйста, перезагрузите страницу :)`);
    // };


    useEffect(() => {
        // localStorage.setItem('recognitionList', JSON.stringify(recognitionTextResult))
    }, [getRecognitionList])


    useEffect(() => {
        let isCancelled = false;
        const runAsync = async () => {
            try {
                if (isRecognitionStarted) {
                    counter > 0 && setTimeout(() => !isCancelled && setCounter(counter - 1), 1000);
                    if (counter === 0) {
                        recognition.stop();
                        onRecognitionStop()
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
        setRecognitionTextResult,
        recognitionTextResult,
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
        setRecognitionList
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