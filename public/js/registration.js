const password = document.getElementsByName('password')[0]
const repeatedPassword = document.getElementsByName('repeatedpassword')[0]
const submit = document.getElementsByName('submit')[0]
submit.addEventListener('click', (e) => {
    if (password.value != repeatedPassword.value) {
        console.log('different pass')
        e.preventDefault()
    } else {
        console.log('same password')
    }
})