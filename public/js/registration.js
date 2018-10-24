const password = document.querySelector('input[type=password]')
const repeatedPassword = document.querySelectorAll('input[type=password]')[1]
const submit = document.querySelector('input[type=submit]')
submit.addEventListener('click', (e) => {
    if (password.value != repeatedPassword.value) {
        console.log('different pass')
        e.preventDefault()
    } else {
        console.log('same password')
    }
})