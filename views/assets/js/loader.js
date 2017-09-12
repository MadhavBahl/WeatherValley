var mainContent = document.getElementById('mainContent');
var loader = document.getElementById('loader');

mainContent.style.display = 'none';
loader.style.display = 'block';
window.onload = () => {
  mainContent.style.display = 'block';
  loader.style.display = 'none';
};
