
const join = $username => {
  console.log($username.value)
}

const onInputEnter = e => {
  if (e.key !== 'Enter') return
  join(e.target)
}

document.addEventListener('DOMContentLoaded', () => {
  
  const $loginButton = document.getElementById('join')
  const $username = document.getElementById('username')

  $loginButton.onclick = () => join($username)
  $username.onkeydown = onInputEnter
})