function openModal(type){
  const m=document.getElementById('modal');
  document.getElementById('modalTitle').textContent=type==='login'?'Login':'Create your account';
  document.getElementById('modalText').textContent=type==='login'
    ?'Enter your details to continue to the dashboard.'
    :'Create an account to start using the panel.';
  m.classList.add('show');
}
function closeModal(e){
  if(!e || e.target.id==='modal' || e.target.classList.contains('close')){
    document.getElementById('modal').classList.remove('show');
  }
}
