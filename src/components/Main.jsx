import React, {useEffect, useState} from 'react';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Button, Card, Form, Input, Layout, message, Skeleton, Switch, Tag} from "antd";
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
        setRecognitionTextResult([...recognitionTextResult, recognitionResult, recognitionTranscript])

    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    // recognition.onerror = (event) => {
    //     recognition.stop();
    //     alert(`произошла ошибка: ${event.error}, пожалуйста, перезагрузите страницу :)`);
    // };

    useEffect(() => {
    }, [])

    const onStartRecordClick = (checked) => {
        if (isRecognitionStarted) {
            recognition.stop();

            setRecognitionList(prev => [recognitionTextResult.filter(item => item), ...prev])
            setRecognitionTextResult([])
            setRecognitionStarted(checked)
        } else {
            recognition.start();
            setRecognitionStarted(checked)
        }
    }

    const TextComponent = ({text}) => {
        return <div className="Text"> {text?.map((item, index) => {
            if (index === 0) {
                const textArray = item.split(' ');

                return textArray?.map(word => {
                    if (whiteList.includes(word.toLocaleLowerCase())) {
                        return <div className="WhiteListWord">{word + ' '}</div>
                    } else if (blackList.includes(word.toLocaleLowerCase())) {
                        return <div className="BlackListWord">{word + ' '}</div>
                    } else return <>{word + ' '}</>
                })
            } else return <i className="Text__italic">{item}</i>
        })}
        </div>
    }

    const TextScroll = () => {
        return <div className="TextScroll">
            {recognitionList.map(item => {
                return <TextComponent text={item}/>
            })}
        </div>
    }

    const ListForm = ({setList}) => {
        const onFinish = (values) => {
            return setList(prev => {
                if (prev.includes(values.tag)) {
                    message.warning(`${values.tag} уже есть в списке!`);
                    return prev
                } else return [...prev, values.tag]
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

    const TagList = ({list, setList}) => {
        const onTagClose = (tag) => {
            setList(list.filter(item => item !== tag))
        }

        return list?.map((tag, index) => {
            return <Tag
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
                        <Card bordered={false}>{recognitionTextResult.length === 0 ?
                            <h2>Включите микрофон для начала распознавания текста
                                <FontAwesomeIcon style={{marginLeft: 6}} icon={faComment}/>
                            </h2> : <TextComponent text={recognitionTextResult}/>
                        }</Card>

                        <TextScroll />
                    </div>
                    <div className="ListSection">
                        <Card bordered={false}>
                            <div className="CardTitle">
                                <h2>White list </h2>
                                <a onClick={() => setWhiteListActive(isWhiteListActive => !isWhiteListActive)}><EditOutlined/></a>
                            </div>
                            <TagList list={whiteList} setList={setWhiteList}/>
                            {isWhiteListActive ? <ListForm setList={setWhiteList}/> : <Skeleton/>}
                        </Card>
                        <Card bordered={false}>
                            <div className="CardTitle">
                                <h2>Black list </h2>
                                <a onClick={() => setBlackListActive(isBlackListActive => !isBlackListActive)}><EditOutlined/></a>
                            </div>
                            <TagList list={blackList} setList={setBlackList}/>
                            {isBlackListActive ? <ListForm setList={setBlackList}/> : <Skeleton/>}
                        </Card>
                    </div>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>Speech Recognition ©2021 Created by TTK Digital</Footer>
        </Layout>
    );
};

export default Main;