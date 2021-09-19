import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Form, Input, message, Progress, Skeleton, Tag} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faEdit} from "@fortawesome/free-solid-svg-icons";


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
                     }) => {

    const formRef = useRef(null);
    const textArray = recognitionList.join(', ').split(' ').map(item => item.replace(/,/g, ''))
    const [whiteListCounter, setWhiteListCounter] = useState(JSON.parse(localStorage.getItem('whiteListCounter')) ?? []);
    const [blackListCounter, setBlackListCounter] = useState(JSON.parse(localStorage.getItem('blackListCounter')) ?? []);

    useEffect(() => {
        localStorage.setItem('whiteList', JSON.stringify(whiteList))
    }, [whiteList])

    useEffect(() => {
        localStorage.setItem('blackList', JSON.stringify(blackList))
    }, [blackList])

    useEffect(() => {
        let newWhiteListCounter = listToObject(whiteList, textArray, whiteListCounter)
        setWhiteListCounter(newWhiteListCounter);
        localStorage.setItem('whiteListCounter', JSON.stringify(newWhiteListCounter));
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

    const listToObject = (filterList, recognitionText, listCounter) => {
        const listObj = filterList.reduce((data, key) => {
            data[key] = recognitionText.filter(x => x === key).length;
            return data;
        }, {});

        let listEntries = Object.entries(listObj)
        // console.log(listCounter)
        // console.log(listEntries)

        // listEntries = mergeArrays(listEntries, listCounter);
        console.log(mergeArrays(listEntries, listCounter))

        return listEntries.sort((a, b) => b[1] - a[1])
    }

    const mergeArrays = (array1, array2) => {
        let array1Copy = [...array1].map((item, index) => {
            let collision = array2.find(el => el[0] === item[0]);

            // console.log(collision)

            if (collision) {
                console.log([collision[0], collision[1] + item[1]])
                return [collision[0], collision[1] + item[1]]
            }
            return item;
        })

        let array2Copy = [...array2];
        array2.forEach((item, index) => {
            if (array1Copy.find(el => el[0] === item[0])) {
                array2Copy = array2Copy.filter(vim => vim !== item)
            }
        })

        return [...array1Copy, ...array2Copy];
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


    const BarChart = ({list, listName}) => {
        if (list.length === 0) {
            return <Skeleton/>
        } else return <div className="BarChartList">
            {list?.map((item, index) => {
                return <div key={index} className="BarChart">
                    <div className="BarChart_Info">
                        <span>{item[0]}:</span>
                        <span>{item[1]}</span>
                    </div>
                    <Progress percent={item[1]} showInfo={false}/>
                </div>
            })}
        </div>
    }


    return (
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
                    // <></>
                    <BarChart list={whiteListCounter} listName={'whiteListObj'} setList={setWhiteList}/>
                }
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
                    // <></>
                    <BarChart list={blackListCounter} listName={'blackListObj'} setList={setBlackList}/>
                }
            </Card>
        </div>
    );
};

export default ListSection;