import request from '@/utils/request'


//上传训练集
export function uploadTrainSet(headers, data) {
    return request({
        url: 'http://112.74.58.26:13390/file/uploadTrainSet',
        method: 'POST',
        timeout: 60 * 1000,
        data: data,
        headers: headers
    })
}

//上传验证集
export function uploadVerifySet(headers, data) {
    return request({
        url: 'http://112.74.58.26:13390/file/uploadVerifySet',
        method: 'POST',
        data: data,
        headers: headers
    })
}
