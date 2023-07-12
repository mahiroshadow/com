//import jsCookie from "js-cookie"

export function setUseravatarUrl(avatarUrl) {
    localStorage.setItem('avatarUrl', avatarUrl)
}

export function getUseravatarUrl() {
    return localStorage.getItem('avatarUrl')
}