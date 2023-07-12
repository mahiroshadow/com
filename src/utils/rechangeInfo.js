import Cookies from "js-cookie"


//为什么不用vuex，因为vuex刷新后数据消失，所以这里用cookie代替存储
const begin_train_name = 'begin_train'

const begin_test_name = 'test_name'

const begin_model_name = 'model_name'

const last_router_name = 'router_name'

const fileReaderpath = 'fileReaderpath'

const lastVerifyId = 'verifyId'

//
export function setTrainBegin(begin) {
    localStorage.setItem(begin_train_name, begin)
}

//
export function getTrainBegin() {
    return localStorage.getItem(begin_train_name)
}

//
export function setTestBegin(begin) {
    localStorage.setItem(begin_test_name, begin)
}

//
export function getTestBegin() {
    return localStorage.getItem(begin_test_name)
}


//
export function setModelBegin(begin) {
    localStorage.setItem(begin_model_name, begin)
}

//
export function getModelBegin() {
    return localStorage.getItem(begin_model_name)
}

//设置需要查看的文件
export function setFilePath(path) {
    localStorage.setItem(fileReaderpath, path)
}


export function getFilePath() {
    return localStorage.getItem(fileReaderpath)
}


//设置上一次跳转的路由
export function setLastRouter(router) {
    localStorage.setItem(last_router_name, router)
}

//获取上一次跳转的路由
export function getLastRouter() {
    return localStorage.getItem(last_router_name)
}

//记录上一次验证的测试集id
export function setLastVerifyId(id) {
    localStorage.setItem(lastVerifyId, id)
}

export function getLastId() {
    return localStorage.getItem(lastVerifyId)
}

