import request from '@/utils/request'

export function downLoadJson(remoteDownLoadUrl) {
    const config = {}
    config.responseType = 'blob'
    request({
        method: 'GET',
        baseURL: remoteDownLoadUrl,
        config: config
    }).then(res => {
        const blob = new Blob([res.data])
        blobDownload(blob)
    })
}

function blobDownload(blob, filename = 'validate.json') {
    let url = window.URL.createObjectURL(blob)
    //  解决 ie 不支持下载 blob资源
    if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, filename)
        return
    }
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}