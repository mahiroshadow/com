import request from '@/utils/request'


//在线验证数据
export function verifyOnline(data) {
    return request({
        url: '/model/onlineVerify_s',
        method: 'post',
        timeout: 1000 * 10,
        data: data
    })
}

//在线训练模型
export function practiceOnline() {
    return request({
        url: '/model/onlineTrain_s',
        method: 'post',
        timeout: 1000 * 60
    })
}