const cards = document.getElementsByClassName('card')
const input = document.querySelector('.send-data > input')
const button = document.querySelector('.send-data > span')
const body = document.getElementsByTagName('body')[0]

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
            const json = JSON.parse(xhr.responseText)

            const div = document.createElement('div')
            div.setAttribute('class', 'card')
            const divText = document.createTextNode(json[json.length - 1].todoTitle)
            div.append(divText)

            const span = document.createElement('span')
            span.setAttribute('class', 'delete')
            const spanText = document.createTextNode('X')
            span.append(spanText)

            div.append(span)

            body.append(div)
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