const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  if (backdrop && sideDrawer) {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
  }
}

function menuToggleClickHandler() {
  if (backdrop && sideDrawer) {
    backdrop.style.display = 'block';
    sideDrawer.classList.add('open');
  }
}

if (backdrop && menuToggle) {
  backdrop.addEventListener('click', backdropClickHandler);
  menuToggle.addEventListener('click', menuToggleClickHandler);
}
