import request from '@/utils/request'


//创建新模型
export function createModel(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/createModel',
        data: data
    })
}

//获取用户模型列表
export function getModelList(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/getUserModelList',
        data: data
    })
}

//用户删除模型
export function deleteModel(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/deleteModel',
        data: data
    })
}

//获取能被训练模型列表和训练集列表
export function getCanBeTrainedList() {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/getCanBeTrainedList'
    })
}



//在线训练模型
export function onlineTrain(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/onlineTrain',
        data: data
    })
}

//
export function getCanBeVerifiedList() {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/getCanBeVerifiedList'
    })
}

//在线测试数据集
export function onlineVerify(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/onlineVerify',
        data: data
    })
}

//查询模型
export function queryModel(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/model/queryModel',
        data: data
    })
}