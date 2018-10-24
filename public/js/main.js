const cards = document.getElementsByClassName('card')
const input = document.querySelector('.send-data > input')
const button = document.querySelector('.send-data > span')

button.addEventListener('click', () => {
    const xhr = new XMLHttpRequest()

    xhr.open('POST', 'https://localhost:3001/home')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(`todo=${input.value}`)
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
})