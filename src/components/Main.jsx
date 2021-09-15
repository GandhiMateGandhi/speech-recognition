import React, {useEffect, useRef, useState} from 'react';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Button, Card, Form, Input, Layout, message, Progress, Skeleton, Switch, Tag} from "antd";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";
import logo from '../img/logo.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComment} from "@fortawesome/free-regular-svg-icons";
import {faArrowLeft, faBackspace, faEdit, faMicrophoneAlt, faUndoAlt} from "@fortawesome/free-solid-svg-icons";

const Main = () => {
    const [isRecognitionStarted, setRecognitionStarted] = useState(false);
    let recognitionResult = '';
    let getRecognitionList = JSON.parse(localStorage.getItem('recognitionList'))
    let getWhiteList = JSON.parse(localStorage.getItem('whiteList'))
    let getBlackList = JSON.parse(localStorage.getItem('blackList'))

    if (getRecognitionList === null) {
        getRecognitionList = []
    }

    if (getWhiteList === null) {
        getWhiteList = []
    }

    if (getBlackList === null) {
        getBlackList = []
    }

    const [recognitionTextResult, setRecognitionTextResult] = useState([]);
    const [recognitionList, setRecognitionList] = useState(getRecognitionList ? getRecognitionList : []);
    const [isWhiteListActive, setWhiteListActive] = useState(false);
    const [isBlackListActive, setBlackListActive] = useState(false);
    const [whiteList, setWhiteList] = useState(getWhiteList ? getWhiteList : []);
    const [blackList, setBlackList] = useState(getBlackList ? getBlackList : []);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;
    const formRef = useRef(null);

    recognition.onresult = (event) => {
        let recognitionTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                const trimmedTranscript = transcript.trim();
                const transcriptArray = trimmedTranscript.split(' ');

                transcriptArray.forEach(transcript => recognitionResult += ` ${transcript}`);
            } else {
                recognitionTranscript += transcript;
            }
        }
        setRecognitionTextResult([...recognitionTextResult, recognitionResult.trim().toLocaleLowerCase(), recognitionTranscript.toLocaleLowerCase()])

    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    // recognition.onerror = (event) => {
    //     recognition.stop();
    //     alert(`произошла ошибка: ${event.error}, пожалуйста, перезагрузите страницу :)`);
    // };


    useEffect(() => {
        // localStorage.setItem('recognitionList', JSON.stringify(recognitionTextResult))
    }, [getRecognitionList])


    const recognitionFunc = () => {
        if (isRecognitionStarted) {
            recognition.stop();

            if (!!recognitionTextResult.length) {
                const filteredTextResult = recognitionTextResult.filter(item => item)
                setRecognitionList(prev => [filteredTextResult, ...prev])

                getRecognitionList.unshift(filteredTextResult)

                localStorage.setItem('recognitionList', JSON.stringify(getRecognitionList))

                if (recognitionList.length > 15) {
                    setRecognitionList(prev => {
                        return prev.slice(0, -1)
                    })
                }

                setRecognitionTextResult([])
            }
            setRecognitionStarted(false)
        } else {
            recognition.start();
            setRecognitionStarted(true)
        }
    }

    /*document.addEventListener('keydown', (e) => {
        if (!e.repeat)
            if (e.key === ' ') {
                console.log(`Key "${e.key}"`);
                // recognitionFunc()
            } else
                return null
    });*/

    const onStartRecordClick = () => {
        recognitionFunc()
    }

    const onKeyWordEditClick = (listActive, setListActive) => {
        setListActive(prev => !prev)

        formRef?.current?.focus();
    }

    const onLocalStorageClear = () => {
        localStorage.removeItem('recognitionList')
        setRecognitionList([])
    }

    const TextComponent = ({text}) => {
        // console.log(text)
        return <div className="Text">
            {text?.map((item, index) => {
                if (index === 0) {
                    const textArray = item.split(' ');

                    return textArray?.map((word) => {
                        if (whiteList.includes(word.toLocaleLowerCase())) {
                            return <div key={word} className="WhiteListWord">{word + ' '}</div>
                        } else if (blackList.includes(word.toLocaleLowerCase())) {
                            return <div key={word} className="BlackListWord">{word + ' '}</div>
                        } else return <>{word + ' '}</>
                    })

                } else return <div key={item} className="Text__italic">{item}</div>
            })}
        </div>
    }

    const TextScroll = () => {
        return <div className="TextBlock">
            {recognitionList.map((item, index) => {
                return <TextComponent key={index} text={item}/>
            })}
        </div>
    }

    const BarChart = ({list}) => {
        if (list.length === 0) {
            return <Skeleton/>
        } else return <div className="BarChartList">{list?.map((item, index) => {
            let textArray = recognitionList.flat().join(', ').split(' ')
            let barChartLength = textArray.reduce((n, val) => {
                return n + (val.toLowerCase().replace(/,/g, '') ===
                    item.toLowerCase().replace(/,/g, ''))
            }, 0)

            return <div key={index} className="BarChart">
                <span className="BarChartName">{`${item}: ${barChartLength}`}</span>
                <Progress percent={barChartLength * 5} showInfo={false}/>
            </div>
        })}
        </div>
    }

    useEffect(() => {
        localStorage.setItem('whiteList', JSON.stringify(whiteList))
    }, [getWhiteList, whiteList])

    useEffect(() => {
        localStorage.setItem('blackList', JSON.stringify(blackList))
    }, [getBlackList, blackList])

    const ListForm = ({setList}) => {
        const onFinish = (values) => {
            formRef.current.focus();

            return setList(prev => {
                if (prev.includes(values?.tag)) {
                    message.warning(`${values.tag} уже есть в списке!`);
                    return prev
                } else return [...prev, values.tag.trim()]
            })
        }

        return <Form onFinish={onFinish}>
            <Form.Item
                name="tag"
                rules={[{required: true, message: 'Ключевое слово не может быть пустым!'}]}
                label={<b>Ключевые слова</b>}>
                <Input autoFocus ref={formRef}/>
            </Form.Item>
            <Form.Item className="AddTag">
                <Button shape="round" type="primary" htmlType="submit">
                    Добавить
                </Button>
            </Form.Item>
        </Form>
    }

    const TagList = ({list, setList, color}) => {
        const onTagClose = (tag) => {
            setList(list.filter(item => item !== tag))
        }

        return list?.map((tag, index) => {
            return <Tag
                color={color}
                className="Tag"
                key={index}
                closable
                onClose={() => onTagClose(tag)}
            >
                {tag}
            </Tag>
        })
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
                    <div className="SpeechSection">
                        <div className="RecognitionSection">

                            <div className="ControlBlock">
                                <Switch onChange={onStartRecordClick}
                                        checked={isRecognitionStarted}
                                        unCheckedChildren={<AudioMutedOutlined/>}
                                        checkedChildren={<AudioOutlined/>}/>

                                <a onClick={() => setRecognitionTextResult([])}>
                                    <FontAwesomeIcon className="ControlBlock_Clear" icon={faBackspace}/>
                                </a>
                            </div>
                            <Card className="RecognitionBlock" bordered={false}>
                                {recognitionTextResult.length === 0 ?
                                    <h2 style={{textAlign: 'center'}}>{isRecognitionStarted ? 'Говорите...' : 'Включите микрофон для начала распознавания текста'}
                                        <FontAwesomeIcon style={{marginLeft: 6}}
                                                         icon={isRecognitionStarted ? faMicrophoneAlt : faComment}/>
                                    </h2> : <TextComponent text={recognitionTextResult}/>
                                }</Card>
                        </div>

                        <div className="TextSection">
                            {recognitionList.length > 0 && <div className="UndoBlock">
                                <a onClick={onLocalStorageClear} title="Очистить историю распознаваний">
                                    <FontAwesomeIcon className="UndoBlock_Icon" icon={faUndoAlt}/>
                                </a>
                            </div>}

                            <TextScroll/>
                        </div>
                    </div>

                    <div className="ListSection">
                        <Card className="WhiteList" bordered={false}>
                            <div className="CardTitle">
                                <h2>Белый список</h2>
                                <a onClick={() => onKeyWordEditClick(isWhiteListActive, setWhiteListActive)}>
                                    <FontAwesomeIcon icon={isWhiteListActive ? faArrowLeft : faEdit}/>
                                </a>
                            </div>
                            {isWhiteListActive ?
                                <div className="TagForm">
                                    <TagList list={whiteList} setList={setWhiteList} color={'blue'}/>
                                    <ListForm setList={setWhiteList}/>
                                </div> :
                                <BarChart list={whiteList} text={recognitionTextResult}/>}
                        </Card>
                        <Card className="BlackList" bordered={false}>
                            <div className="CardTitle">
                                <h2>Черный список</h2>
                                <a onClick={() => onKeyWordEditClick(isBlackListActive, setBlackListActive)}>
                                    <FontAwesomeIcon icon={isBlackListActive ? faArrowLeft : faEdit}/>
                                </a>
                            </div>
                            {isBlackListActive ?
                                <div className="TagForm">
                                    <TagList list={blackList} setList={setBlackList} color={'red'}/>
                                    <ListForm setList={setBlackList}/>
                                </div> :
                                <BarChart list={blackList} text={recognitionTextResult}/>}
                        </Card>
                    </div>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>Speech Recognition ©2021 Created by TTK Digital</Footer>
        </Layout>
    );
};

export default Main;