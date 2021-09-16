import React from 'react';
import {Card, Switch} from "antd";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackspace, faMicrophoneAlt, faUndoAlt} from "@fortawesome/free-solid-svg-icons";
import {faComment} from "@fortawesome/free-regular-svg-icons";

const SpeechSection = ({
                           onStartRecordClick,
                           onStopRecordClick,
                           isRecognitionStarted,
                           counter,
                           setRecognitionTextResult,
                           recognitionTextResult,
                           recognitionList,
                           whiteList,
                           blackList,
                           setRecognitionList
                       }) => {

    const onLocalStorageClear = () => {
        localStorage.removeItem('recognitionList')
        setRecognitionList([])
    }

    const TextComponent = ({text}) => {
        return <div className="Text">
            {text?.map((item, index) => {
                if (index === 0) {
                    const textArray = item.split(' ');

                    return textArray?.map((word) => {
                        if (whiteList.includes(word.toLocaleLowerCase())) {
                            return <div key={word + 'WhiteListWord'} className="WhiteListWord">{word + ' '}</div>
                        } else if (blackList.includes(word.toLocaleLowerCase())) {
                            return <div key={word + 'WhiteListWord'} className="BlackListWord">{word + ' '}</div>
                        } else return <>{word + ' '}</>
                    })

                } else return <div key={item + 'Text__italic'} className="Text__italic">{item}</div>
            })}
        </div>
    }

    const TextScroll = () => {
        return <div className="TextBlock">
            {recognitionList?.map((item, index) => {
                return <TextComponent key={item} text={item}/>
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

                        {/*<button onClick={onStartRecordClick}>start</button>*/}
                        {/*<button onClick={onStopRecordClick}>stop</button>*/}
                        {
                            isRecognitionStarted &&
                            <div className="Counter">
                                <div className="RecordingDot"/>
                                00:{counter}
                            </div>}
                    </div>
                    <a onClick={() => setRecognitionTextResult([])}>
                        <FontAwesomeIcon className="ControlBlock_Clear" icon={faBackspace}/>
                    </a>
                </div>
                <Card className="RecognitionBlock" bordered={false}>
                    {recognitionTextResult.length === 0 ?
                        <h2 style={{textAlign: 'center'}}>
                            {isRecognitionStarted ? 'Говорите...' : 'Включите микрофон для начала распознавания текста'}
                            <FontAwesomeIcon style={{marginLeft: 6}}
                                             icon={isRecognitionStarted ? faMicrophoneAlt : faComment}/>
                        </h2> :
                        <TextComponent text={recognitionTextResult}/>
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
    );
};

export default SpeechSection;