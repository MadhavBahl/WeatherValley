var mainContent = document.getElementById('mainContent');
var loader = document.getElementById('loader');

mainContent.style.display = 'none';
loader.style.display = 'block';
console.log('Loader On');

window.onload = () => {
  mainContent.style.display = 'block';
  loader.style.display = 'none';
  console.log('Loader Off');
};
