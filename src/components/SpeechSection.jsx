import React, {useEffect, useRef} from 'react';
import {Card, Switch} from "antd";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackspace, faMicrophoneAlt, faUndoAlt} from "@fortawesome/free-solid-svg-icons";
import {faComment} from "@fortawesome/free-regular-svg-icons";
import ScrollableFeed from "react-scrollable-feed";

const SpeechSection = ({
                           onStartRecordClick,
                           onStopRecordClick,
                           isRecognitionStarted,
                           counter,
                           resetTranscript,
                           whiteList,
                           blackList,
                           setRecognitionList,
                           transcript,
                           recognitionList
                       }) => {


    const onLocalStorageClear = () => {
        localStorage.removeItem('recognitionList')
        setRecognitionList([])
    }

    const TextComponent = ({text}) => {


        return <div className="Text">
            {/*<ShowMoreText*/}
            {/*    lines={3}*/}
            {/*    more="Раскрыть"*/}
            {/*    less="Закрыть"*/}
            {/*    truncatedEndingComponent={"... "}*/}
            {/*>*/}
            {text?.map((item, index) => {
                if (whiteList.includes(item.toLocaleLowerCase())) {
                    return <p key={index} className="WhiteListWord">{item + ' '}</p>
                } else if (blackList.includes(item.toLocaleLowerCase())) {
                    return <p key={index} className="BlackListWord">{item + ' '}</p>
                } else return <p key={index}>{item + ' '}</p>
            })}
            {/*</ShowMoreText>*/}
        </div>
    }

    const TextScroll = () => {
        return <div className="TextBlock">
            {recognitionList?.map((item, index) => {
                return <TextComponent key={index} text={item.split(' ')}/>
            })}
        </div>
    }

    return (
        <div className="SpeechSection">
            <div className="RecognitionSection">

                <div className="ControlBlock">
                    <div className="ControlBlock_Switch">
                        <Switch onChange={isRecognitionStarted ? onStopRecordClick : onStartRecordClick}
                                checked={isRecognitionStarted}
                                unCheckedChildren={<AudioMutedOutlined/>}
                                checkedChildren={<AudioOutlined/>}
                                autoFocus={true}/>

                        {
                            isRecognitionStarted &&
                            <div className="Counter">
                                <div className="RecordingDot"/>
                                00:{counter}
                            </div>}
                    </div>
                    <a onClick={() => resetTranscript()}>
                        <FontAwesomeIcon className="ControlBlock_Clear" icon={faBackspace}/>
                    </a>
                </div>
                <Card className="RecognitionBlock" bordered={false}>
                    {!transcript ?
                        <h2 style={{textAlign: 'center'}}>
                            {isRecognitionStarted ? 'Говорите...' : 'Включите микрофон для начала распознавания текста'}
                            <FontAwesomeIcon style={{marginLeft: 6}}
                                             icon={isRecognitionStarted ? faMicrophoneAlt : faComment}/>
                        </h2> : <ScrollableFeed className="Scrollable">
                            <TextComponent text={transcript.split(' ')}/>
                        </ScrollableFeed>
                    }
                </Card>
            </div>

            <div className="TextSection">
                {recognitionList.length > 0 &&
                <div className="UndoBlock">
                    <a onClick={onLocalStorageClear} title="Очистить историю распознаваний">
                        <FontAwesomeIcon className="UndoBlock_Icon" icon={faUndoAlt}/>
                    </a>
                </div>}

                <TextScroll/>
            </div>
        </div>
    );
};

export default SpeechSection;