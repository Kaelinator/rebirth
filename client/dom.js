/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const join = $username => {
  joinGame($username.value)
}

const onInputEnter = e => {
  if (e.key !== 'Enter') return
  join(e.target)
}

const hideLogin = () => {
  document.getElementById('join-container').classList.add('hidden')
}

document.addEventListener('DOMContentLoaded', () => {
  
  const $loginButton = document.getElementById('join')
  const $username = document.getElementById('username')

  $loginButton.onclick = () => join($username)
  $username.onkeydown = onInputEnter
})