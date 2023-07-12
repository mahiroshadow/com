//import Cookies from "js-cookie"

//定义要存储的信息名称
const modelName = 'model'

//存储模型信息
// export function modelInfoStore(model) {
//     Cookies.set(modelName, model)
// }

// //获取模型信息
// export function getModelInfo() {
//     return Cookies.get(modelName)
// }



export function modelInfoStore(model) {
    localStorage.setItem(modelName, JSON.stringify(model))
}

export function getModelInfo() {
    return localStorage.getItem(modelName)
}

