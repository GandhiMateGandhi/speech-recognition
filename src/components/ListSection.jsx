import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Form, Input, message, Popconfirm, Progress, Skeleton, Tag} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faEdit, faUndoAlt} from "@fortawesome/free-solid-svg-icons";
import {text} from "@fortawesome/fontawesome-svg-core";


const ListSection = ({
                         isWhiteListActive,
                         setWhiteListActive,
                         whiteList,
                         setWhiteList,
                         isBlackListActive,
                         setBlackListActive,
                         blackList,
                         setBlackList,
                         recognitionList,
                         recognitionListLS,
                         newTranscript
                     }) => {

    const formRef = useRef(null);
    const isInitialWhiteListMount = useRef(true);
    const isInitialBlackListMount = useRef(true);
    const textArray = recognitionListLS.join(', ').split(' ').map(item => item.replace(/,/g, ''))

    const [whiteListCounter, setWhiteListCounter] = useState(JSON.parse(localStorage.getItem('whiteListCounter')) ?? []);
    const [blackListCounter, setBlackListCounter] = useState(JSON.parse(localStorage.getItem('blackListCounter')) ?? []);

    useEffect(() => {
        localStorage.setItem('whiteList', JSON.stringify(whiteList))
    }, [whiteList])

    useEffect(() => {
        localStorage.setItem('blackList', JSON.stringify(blackList))
    }, [blackList])

    useEffect(() => {
        // if (isInitialWhiteListMount.current) {
        //     isInitialWhiteListMount.current = false;
        // } else {
        let newWhiteListCounter = listToObject(whiteList, textArray, whiteListCounter)
        setWhiteListCounter(newWhiteListCounter);

        localStorage.setItem('whiteListCounter', JSON.stringify(newWhiteListCounter));
        // }
    }, [whiteList, recognitionList])

    useEffect(() => {
        let newBlackListCounter = listToObject(blackList, textArray, blackListCounter)
        setBlackListCounter(newBlackListCounter);
        localStorage.setItem('blackListCounter', JSON.stringify(newBlackListCounter));
    }, [blackList, recognitionList])

    const onKeyWordEditClick = (listActive, setListActive) => {
        setListActive(prev => !prev)
        formRef?.current?.focus();
    }

    const listToObject = (filterList, recognitionText, counterList) => {
        const listObj = filterList.reduce((data, key) => {
            data[key] = recognitionText.filter(x => x.toLowerCase() === key.toLowerCase()).length;
            return data;
        }, {});

        // console.log(listObj)

        const transcriptArray = Object.entries(filterList.reduce((data, key) => {
            data[key] = newTranscript.filter(x => x === key).length;
            return data;
        }, {}));

        // console.log(transcriptArray)

        let listEntries = Object.entries(listObj)
        // listEntries = mergeArrays(listEntries, counterList, transcriptArray);

        return listEntries.sort((a, b) => b[1] - a[1])
    }

    const mergeArrays = (arrayRL, arrayLS, transcriptArray) => {

        let prevArray = [...arrayRL].map((wordRL, index) => {
            const found = arrayRL.some(r => newTranscript.includes(r[0]))
            // console.log(found)

            let collision = transcriptArray.find(keyWord => (keyWord[0] === wordRL[0]));
            if (collision && found) {
                // console.log([collision[0], collision[1] + wordRL[1]])
                return [collision[0], collision[1] + wordRL[1]]
            }
            return wordRL;
        })

        // console.log(arrayLS)
        // console.log(transcriptArray)

        let newArray = [...transcriptArray];
        transcriptArray.forEach((item) => {
            if (prevArray.find(el => el[0] === item[0])) {
                newArray = newArray.filter(vim => vim !== item)
            }
        })

        return [...prevArray, ...newArray];
    }

    const ListClearButton = ({clearList}) => {

        const onWhiteListClear = () => {
            if (clearList === 'whiteListCounter') {
                setWhiteList([])
                setWhiteListCounter([])
            } else {
                setBlackList([])
                setBlackListCounter([])
            }
            localStorage.removeItem('recognitionListLS')
            localStorage.removeItem(clearList)
        }

        return <Popconfirm
            placement="topRight"
            title={'Вы уверены, что хотите очистить историю совпадений?'}
            onConfirm={onWhiteListClear}
            okText="Да"
            cancelText="Нет">
            <a title="Очистить историю совпадений">
                <FontAwesomeIcon className="ListClear" icon={faUndoAlt}/>
            </a>
        </Popconfirm>
    }

    const ListForm = ({setList}) => {
        const onFinish = (values) => {
            formRef.current.focus();

            return setList(prev => {
                if (prev.includes(values?.tag)) {
                    message.warning(`${values.tag} уже есть в списке!`);
                    return prev
                } else if (whiteList.includes(values?.tag) || blackList.includes(values?.tag)) {
                    message.warning(`${values.tag} уже есть в другом списке!`);
                    return prev
                }
                return [...prev, values.tag.trim()]
            })
        }

        return <Form onFinish={onFinish}>
            <Form.Item
                name="tag"
                rules={[{required: true, message: 'Ключевое слово не может быть пустым!'}]}
                label={<b>Ключевые слова</b>}>
                <Input autoFocus autoComplete='off' ref={formRef}/>
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


    const BarChart = ({list, listName}) => {
        if (listName.length === 0) {
            return <Skeleton/>
        } else return <div className="BarChartList">
            {list?.map((item, index) => {
                return <div key={index} className="BarChart">
                    <div className="BarChart_Info">
                        <span>{item[0]}:</span>
                        <span>{item[1]}</span>
                    </div>
                    <Progress percent={(item[1])} showInfo={false}/>
                </div>
            })}
        </div>
    }


    return (
        <div className="ListSection">
            <Card className="WhiteList" bordered={false}>
                <div className="CardTitle">
                    <h2>Белый список</h2>
                    <div className="ListButtons">
                        <ListClearButton clearList="whiteListCounter"/>
                        <a title="Редактировать белый список"
                           onClick={() => onKeyWordEditClick(isWhiteListActive, setWhiteListActive)}>
                            <FontAwesomeIcon icon={isWhiteListActive ? faArrowLeft : faEdit}/>
                        </a>
                    </div>
                </div>
                <div className="ListScroll">
                    {isWhiteListActive ?
                        <div className="TagForm">
                            <TagList list={whiteList} setList={setWhiteList} color={'blue'}/>
                            <ListForm setList={setWhiteList}/>
                        </div> :
                        <BarChart list={whiteListCounter} listName={whiteList} setList={setWhiteList}/>
                    }
                </div>
            </Card>
            <Card className="BlackList" bordered={false}>
                <div className="CardTitle">
                    <h2>Черный список</h2>
                    <div className="ListButtons">
                        <ListClearButton clearList="blackListCounter"/>
                        <a title="Редактировать черный список"
                           onClick={() => onKeyWordEditClick(isBlackListActive, setBlackListActive)}>
                            <FontAwesomeIcon icon={isBlackListActive ? faArrowLeft : faEdit}/>
                        </a>
                    </div>
                </div>
                <div className="ListScroll">

                    {isBlackListActive ?
                        <div className="TagForm">
                            <TagList list={blackList} setList={setBlackList} color={'red'}/>
                            <ListForm setList={setBlackList}/>
                        </div> :
                        // <></>
                        <BarChart list={blackListCounter} listName={blackList} setList={setBlackList}/>
                    }
                </div>
            </Card>
        </div>
    );
};

export default ListSection;