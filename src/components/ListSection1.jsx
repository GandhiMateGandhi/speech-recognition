import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Form, Input, message, Progress, Skeleton, Tag} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faEdit, faUndoAlt} from "@fortawesome/free-solid-svg-icons";


const ListSection = ({
                         transcript,
                         isWhiteListActive,
                         setWhiteListActive,
                         whiteList,
                         setWhiteList,
                         isBlackListActive,
                         setBlackListActive,
                         blackList,
                         setBlackList,
                         getWhiteList,
                         getBlackList,
                         recognitionList,
                     }) => {

    const formRef = useRef(null);
    const textArray = recognitionList.flat().join(', ').split(' ').map(item => item.replace(/,/g, ''))

    const onKeyWordEditClick = (listActive, setListActive) => {
        setListActive(prev => !prev)
        formRef?.current?.focus();
    }


    const ListClearButton = ({clearList}) => {

        const onWhiteListClear = () => {
            // console.log(clearList)
            // localStorage.removeItem(list)
        }

        return <a onClick={onWhiteListClear} title="Очистить историю совадений">
            <FontAwesomeIcon className="ListClear" icon={faUndoAlt}/>
        </a>
    }

    const listToObject = (wordList, text) => {
        const listObj = wordList.reduce((data, key) => {
            data[key] = text.filter(x => {
                if (x === key) {
                    return x === key
                }
            }).length;
            return data;
        }, {});

        const listEntries = Object.entries(listObj)

        return listEntries.sort((a, b) => b[1] - a[1])
    }

    const whiteListArray = listToObject(whiteList, textArray)
    const blackListArray = listToObject(blackList, textArray)

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
                    <Progress percent={(item[1]) * 4} showInfo={false}/>
                </div>
            })}
        </div>
    }

    // localStorage.setItem('whiteListArray', JSON.stringify(whiteListObject))

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

    return (
        <div className="ListSection">
            <Card className="WhiteList" bordered={false}>
                <div className="CardTitle">
                    <h2>Белый список</h2>
                    <div>
                        <ListClearButton clearList="whiteListArray"/>
                        <a title="Редактировать белый список"
                           onClick={() => onKeyWordEditClick(isWhiteListActive, setWhiteListActive)}>
                            <FontAwesomeIcon icon={isWhiteListActive ? faArrowLeft : faEdit}/>
                        </a>
                    </div>
                </div>
                {isWhiteListActive ?
                    <div className="TagForm">
                        <TagList list={whiteList} setList={setWhiteList} color={'blue'}/>
                        <ListForm setList={setWhiteList}/>
                    </div> :
                    <BarChart list={whiteListArray} listName={'whiteListObj'} setList={setWhiteList}/>}
            </Card>
            <Card className="BlackList" bordered={false}>
                <div className="CardTitle">
                    <h2>Черный список</h2>
                    <div>
                        <ListClearButton clearList="blackListArray"/>
                        <a title="Редактировать черный список"
                           onClick={() => onKeyWordEditClick(isBlackListActive, setBlackListActive)}>
                            <FontAwesomeIcon icon={isBlackListActive ? faArrowLeft : faEdit}/>
                        </a>
                    </div>
                </div>
                {isBlackListActive ?
                    <div className="TagForm">
                        <TagList list={blackList} setList={setBlackList} color={'red'}/>
                        <ListForm setList={setBlackList}/>
                    </div> :
                    <BarChart list={blackListArray} listName={'blackListObj'} setList={setBlackList}/>}
            </Card>
        </div>
    );
};

export default ListSection;