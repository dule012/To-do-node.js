const cards = document.getElementsByClassName('card')
const finishedTodo = document.getElementsByClassName('finished1')
const X = document.getElementsByClassName('delete')
const title = document.getElementsByClassName('title')
const input = document.querySelector('.send-data > input')
const button = document.querySelector('.send-data > span')
const body = document.getElementsByTagName('body')[0]
// console.log(title[1].textContent.trim())

const xhrPUT = (value, isFinished) => {
    const xhr = new XMLHttpRequest
    xhr.open('PUT', '/')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(`todoTitle=${value}&finished=${isFinished}`)
    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            console.log('loaded')
            console.log(xhr.responseText)

            const json = JSON.parse(xhr.responseText)

            for (let j = 0; j < title.length; j++) {
                if (title[j].textContent.trim() == json.todoTitle) {
                    console.log('title[j] found')
                    if (json.finished == 'true') {
                        cards[j].classList.remove('to-finish')
                        cards[j].classList.add('finished1')
                        console.log(cards[j])
                    } else {
                        cards[j].classList.remove('finished1')
                        cards[j].classList.add('to-finish')
                        console.log(cards[j])
                    }
                }
            }
        }
    })
    xhr.addEventListener('error', () => {
        console.log('error')
    })
}


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
            div.setAttribute('class', 'card to-finish')
            const p = document.createElement('p')
            p.setAttribute('class', 'title')
            const pText = document.createTextNode(json[json.length - 1].todoTitle)
            p.append(pText)
            div.append(p)

            const span = document.createElement('span')
            span.setAttribute('class', 'delete')
            const spanText = document.createTextNode('X')
            span.append(spanText)

            div.append(span)

            body.append(div)

            cards[cards.length - 1].addEventListener('click', (e) => {
                if (e.target.closest('.card') == cards[cards.length - 1] && e.target.closest('.delete') != X[X.length - 1]) {
                    const targetTitle = title[title.length - 1].textContent.trim()

                    if (e.currentTarget.classList.contains('to-finish')) {
                        xhrPUT(targetTitle, true)
                    } else {
                        xhrPUT(targetTitle, false)
                    }
                }
            })

            X[X.length - 1].addEventListener('click', (e) => {
                console.log('delete?')
                const todoTitle = e.currentTarget.previousElementSibling.textContent.trim()
                const targetedCard = e.currentTarget.closest('.card')
                xhrDELETE(todoTitle, targetedCard)
            })
        }
    })
    xhr.addEventListener('error', () => {
        console.log('erorororor')
    })
    input.value = ''
}


const xhrDELETE = (elTextContent, el) => {
    const xhr = new XMLHttpRequest
    xhr.open('DELETE', '/')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(`todoTitle=${elTextContent}`)
    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            console.log('loaded')
            el.remove()
        }
    })
    xhr.addEventListener('error', () => {
        console.log('error delete')
    })

}

button.addEventListener('click', () => {
    for (let i = 0; i < cards.length; i++) {
        if (input.value.trim() == title[i].textContent.trim()) {
            return
        }
    }
    xhrPOST()
})

input.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        for (let i = 0; i < cards.length; i++) {
            if (input.value.trim() == title[i].textContent.trim()) {
                return
            }
        }
        xhrPOST()
    }
})



for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', (e) => {
        if (e.target.closest('.card') == cards[i] && e.target.closest('.delete') != X[i]) {
            console.log('put?')
            const targetTitle = title[i].textContent.trim()

            if (e.currentTarget.classList.contains('to-finish')) {
                xhrPUT(targetTitle, true)
            } else {
                xhrPUT(targetTitle, false)
            }
        }
    })
}

for (let i = 0; i < X.length; i++) {
    X[i].addEventListener('click', (e) => {
        console.log('delete?')
        const todoTitle = e.currentTarget.previousElementSibling.textContent.trim()
        const targetedCard = e.currentTarget.closest('.card')
        xhrDELETE(todoTitle, targetedCard)
    })
}