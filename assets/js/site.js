// Minimal helper for nav active state
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('[data-nav]');
  links.forEach(a=>{
    const target = a.getAttribute('href').split('/').pop();
    if(target === path){ a.classList.add('active'); }
  });
})();
