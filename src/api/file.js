import request from '@/utils/request'


//读取csv文件
export function readCsv(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/csv/csvReader',
        data: data
    })
}

//获取用户上传的训练集列表
export function getUserUploadTrainSet(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/getTrainSetList',
        data: data
    })
}

//查询训练集
export function queryTrainSet(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/queryTrainSet',
        data: data
    })
}


//删除训练集
export function deleteTrainSet(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/deleteTrainSet',
        data: data
    })
}

//获取用户上传的测试列表
export function getUserUploadTestSet(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/getVerifySetList',
        data: data
    })
}

//查询测试集
export function queryTestSet(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/queryTestSet',
        data: data
    })
}

//删除测试集
export function deleteTestSet(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/deleteTestSet',
        data: data
    })
}

//获取分类结果
export function getClassifiedResult(data) {
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/getClassifiedResult',
        data: data
    })
}
