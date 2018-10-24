const cards = document.getElementsByClassName('card')
const input = document.querySelector('.send-data > input')
const button = document.querySelector('.send-data > span')

const xhrPOST = () => {
    const xhr = new XMLHttpRequest()

    xhr.open('POST', '/')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    let todovalue = input.value
    xhr.send(`todoTitle=${todovalue}&finished=false`)
    xhr.addEventListener('load', () => {
        console.log('loaded')
        if (xhr.status >= 200 && xhr.status < 400) {
            console.log(xhr.responseText)
        }
    })
    xhr.addEventListener('error', () => {
        console.log('erorororor')
    })
    input.value = ''
}
button.addEventListener('click', () => {
    xhrPOST()
})

input.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        xhrPOST()
    }
})