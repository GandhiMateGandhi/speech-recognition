import React, {useEffect, useState} from 'react';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Button, Card, Form, Input, Layout, message, Progress, Skeleton, Switch, Tag} from "antd";
import {AudioMutedOutlined, AudioOutlined, EditOutlined, ReloadOutlined} from "@ant-design/icons";
import logo from '../img/logo_letai_blue.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComment} from "@fortawesome/free-regular-svg-icons";

const Main = () => {
    const [isRecognitionStarted, setRecognitionStarted] = useState(false);
    let recognitionResult = '';

    // const [recognitionResult, setRecognitionResult] = useState('');
    const [recognitionTextResult, setRecognitionTextResult] = useState([]);
    const [recognitionList, setRecognitionList] = useState([]);
    const [isWhiteListActive, setWhiteListActive] = useState(false);
    const [isBlackListActive, setBlackListActive] = useState(false);
    const [whiteList, setWhiteList] = useState([]);
    const [blackList, setBlackList] = useState([]);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;

    // useEffect(() => {
    //     if (isRecognitionStarted) {
    //         console.log('inside useeffect')
    //         const timer = setTimeout(() => setRecognitionStarted(false), 3000);
    //         recognition.stop();
    //         return () => clearTimeout(timer);
    //     }
    // })

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
        setRecognitionTextResult([...recognitionTextResult, recognitionResult.trim(), recognitionTranscript])

    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    // recognition.onerror = (event) => {
    //     recognition.stop();
    //     alert(`произошла ошибка: ${event.error}, пожалуйста, перезагрузите страницу :)`);
    // };

    const onStartRecordClick = (checked) => {
        if (isRecognitionStarted) {
            recognition.stop();

            if (!!recognitionTextResult.length) {
                setRecognitionList(prev => [recognitionTextResult.filter(item => item), ...prev])
                if (recognitionList.length > 15) {
                    setRecognitionList(prev => {
                        return prev.slice(0, -1)
                    })
                }

                setRecognitionTextResult([])
            }
            setRecognitionStarted(checked)
        } else {
            recognition.start();
            setRecognitionStarted(checked)
        }
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
        return <div className="TextScroll">
            {recognitionList.map((item, index) => {
                return <TextComponent key={index} text={item}/>
            })}
        </div>
    }

    const BarChart = ({list, text}) => {
        if (list.length === 0) {
            return <Skeleton/>
        } else return <div className="BarChartList">{list?.map((item, index) => {
            // let listLength = text

            // console.log(listLength)

            return <div key={index} className="BarChart">
                <span className="BarChartName">{item}</span>
                <Progress percent={50} showInfo={false}/>
            </div>
        })}
        </div>
    }

    const ListForm = ({setList}) => {
        const onFinish = (values) => {
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
                label={<b>Ключевые слова</b>}>
                <Input/>
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
                    <h1>Speech to text Tattelecom Kit</h1>
                </div>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Layout className="Layout">
                    <div className="SpeechSection">
                        <div className="ButtonSection">
                            <Switch onChange={onStartRecordClick}
                                    checked={isRecognitionStarted}
                                    unCheckedChildren={<AudioMutedOutlined/>}
                                    checkedChildren={<AudioOutlined/>}/>
                            <a onClick={() => setRecognitionTextResult([])}>
                                <ReloadOutlined style={{fontSize: 20}}/>
                            </a>
                        </div>
                        <Card className="RecognitionCard" bordered={false}>{recognitionTextResult.length === 0 ?
                            <h2 style={{textAlign: 'center'}}>{isRecognitionStarted ? 'Говорите...' : 'Включите микрофон для начала распознавания текста'}
                                <FontAwesomeIcon style={{marginLeft: 6}} icon={faComment}/>
                            </h2> : <TextComponent text={recognitionTextResult}/>
                        }</Card>

                        <TextScroll/>
                    </div>

                    <div className="ListSection">
                        <Card className="WhiteList" bordered={false}>
                            <div className="CardTitle">
                                <h2>Белый список</h2>
                                <a onClick={() => setWhiteListActive(isWhiteListActive => !isWhiteListActive)}><EditOutlined/></a>
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
                                <a onClick={() => setBlackListActive(isBlackListActive => !isBlackListActive)}><EditOutlined/></a>
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