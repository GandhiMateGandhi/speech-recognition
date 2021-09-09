import React, {useState} from 'react';
import {Content, Footer, Header} from "antd/es/layout/layout";
import {Button, Card, Form, Input, Layout, Skeleton, Switch, Tag} from "antd";
import {AudioMutedOutlined, AudioOutlined, EditOutlined, ReloadOutlined} from "@ant-design/icons";
import logo from '../img/logo_letai_blue.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComment} from "@fortawesome/free-regular-svg-icons";

const Main = () => {
    const [recognitionStarted, setRecognitionStarted] = useState(false);
    let recognitionResult = '';

    // const [recognitionResult, setRecognitionResult] = useState('');
    const [recognitionTextResult, setRecognitionTextResult] = useState('');
    const [isWhiteListActive, setWhiteListActive] = useState(false);
    const [isBlackListActive, setBlackListActive] = useState(false);
    const [whiteList, setWhiteList] = useState([]);
    const [blackList, setBlackList] = useState([]);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;
    let colors = {};

    colors['красный'] = 'red';
    colors['оранжевый'] = 'orange';
    colors['желтый'] = 'yellow';
    colors['жёлтый'] = 'yellow';
    colors['зеленый'] = 'green';
    colors['зелёный'] = 'green';
    colors['синий'] = 'blue';


    const onStartRecordClick = () => {
        if (recognitionStarted) {
            recognition.stop();
            setRecognitionStarted(false)
        } else {
            recognition.start();
            setRecognitionStarted(true)
        }
    }

    recognition.onresult = (event) => {

        let recognitionTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {

            let transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {

                const trimmedTranscript = transcript.trim();
                const transcriptArray = trimmedTranscript.split(' ');

                transcriptArray.forEach(transcript => {
                    const lowerCaseTranscript = transcript.toLocaleLowerCase();

                    // if ( colors[lowerCaseTranscript] ) {
                    //     recognitionResult += ` <span class="transcript" style="background-color: ${colors[lowerCaseTranscript]};">` + transcript + `</span>`;
                    // } else {
                    recognitionResult += ' ' + transcript;
                    // }
                    // setRecognitionResult(`${recognitionResult} ${transcript}`)

                });

            } else {
                recognitionTranscript += transcript;
            }

        }
        setRecognitionTextResult(`${recognitionTextResult} ${recognitionResult} ${recognitionTranscript}`)
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    // recognition.onerror = (event) => {
    //     recognition.stop();
    //     alert(`произошла ошибка: ${event.error}, пожалуйста, перезагрузите страницу :)`);
    // };

    console.log(whiteList, blackList)


    const ListForm = ({list, setList}) => {
        const onFinish = (values) => {
            setList([...list, values.tag])
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

        return list.map((tag, index) => {
            return <Tag
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
                            <Switch onClick={onStartRecordClick}
                                    unCheckedChildren={<AudioMutedOutlined/>}
                                    checkedChildren={<AudioOutlined/>}/>
                            <a onClick={() => setRecognitionTextResult('')}>
                                <ReloadOutlined style={{fontSize: 20}}/>
                            </a>
                        </div>
                        <Card bordered={false}>{recognitionTextResult.length === 0 ?
                            <h2>Включите микрофон для начала распознавания текста
                                <FontAwesomeIcon style={{marginLeft: 6}} icon={faComment}/></h2> :
                            <h3>{recognitionTextResult}</h3>}</Card>
                    </div>
                    <div className="ListSection">
                        <Card bordered={false}>
                            <div className="Card">
                                <h2>White list </h2>
                                <a onClick={() => setWhiteListActive(!isWhiteListActive)}><EditOutlined/></a>
                            </div>
                            <TagList list={whiteList} setList={setWhiteList}/>
                            {isWhiteListActive ? <ListForm list={whiteList} setList={setWhiteList}/> : <Skeleton/>}
                        </Card>
                        <Card bordered={false}>
                            <div className="Card">
                                <h2>Black list </h2>
                                <a onClick={() => setBlackListActive(!isBlackListActive)}><EditOutlined/></a>
                            </div>
                            <TagList list={blackList} setList={setBlackList}/>
                            {isBlackListActive ? <ListForm list={blackList} setList={setBlackList}/> : <Skeleton/>}
                        </Card>
                    </div>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>Speech Recognition ©2021 Created by TTK Digital</Footer>
        </Layout>
    );
};

export default Main;