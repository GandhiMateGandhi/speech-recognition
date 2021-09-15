import React, {useEffect, useRef} from 'react';
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
                         getWhiteList,
                         getBlackList,
                         recognitionList
                     }) => {

    const formRef = useRef(null);


    const onKeyWordEditClick = (listActive, setListActive) => {
        setListActive(prev => !prev)

        formRef?.current?.focus();
    }

    const BarChart = ({list, setList}) => {
        if (list.length === 0) {
            return <Skeleton/>
        } else return <div className="BarChartList">
            {list?.map((item, index) => {
                let textArray = recognitionList.flat().join(', ').split(' ')
                let barChartLength = textArray.reduce((n, val) => {
                    return n + (val.toLowerCase().replace(/,/g, '') ===
                        item.toLowerCase().replace(/,/g, ''))
                }, 0)

                return <div key={index} id={barChartLength} className="BarChart">
                    <span className="BarChartName">{`${item}: ${barChartLength}`}</span>
                    <Progress percent={barChartLength * 4} showInfo={false}/>
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
                    <a onClick={() => onKeyWordEditClick(isWhiteListActive, setWhiteListActive)}>
                        <FontAwesomeIcon icon={isWhiteListActive ? faArrowLeft : faEdit}/>
                    </a>
                </div>
                {isWhiteListActive ?
                    <div className="TagForm">
                        <TagList list={whiteList} setList={setWhiteList} color={'blue'}/>
                        <ListForm setList={setWhiteList}/>
                    </div> :
                    <BarChart list={whiteList} setList={setWhiteList}/>}
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
                    <BarChart list={blackList} setList={setBlackList}/>}
            </Card>
        </div>
    );
};

export default ListSection;