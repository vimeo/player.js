import './style.css';
import { initNavigation, handleNavigation } from './navigation';

// Initialize the app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app">
    <main></main>
  </div>
`;

// Setup navigation
initNavigation();
handleNavigation();

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  handleNavigation();
});
