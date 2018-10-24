const username = document.querySelector('input[type=text]')
const password = document.querySelector('input[type=password]')
const repeatedPassword = document.querySelectorAll('input[type=password]')[1]
const submit = document.querySelector('input[type=submit]')
submit.addEventListener('click', (e) => {
    if (password.value != repeatedPassword.value || username.value == '' || password.value == '' || repeatedPassword.value == '') {
        console.log('can not register')
        e.preventDefault()
    } else {
        console.log('same password')
    }
})