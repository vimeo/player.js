import { handleNavigation } from '../navigation';

export function initHomePage() {
  const main = document.querySelector('main')!;
  main.innerHTML = `
    <div class="example-page">
      <h1>Vimeo Player.js Examples</h1>
      <p>Welcome to the Vimeo Player.js examples. Choose an example from the navigation above:</p>
      
      <ul>
        <li><a href="/lazy-load"><strong>Lazy Loading</strong></a> - Load the player only when needed</li>
        <li><a href="/wrap-iframe"><strong>Wrap Iframe</strong></a> - Wrap the player in an iframe</li>
        <li><a href="/cue-points"><strong>Cue Points</strong></a> - Trigger actions at specific timestamps</li>
        <li><a href="/custom-colors"><strong>Custom Colors</strong></a> - Customize the player's appearance</li>
        <li><a href="/react-wrapper"><strong>React Wrapper</strong></a> - Wrap the player in a React component with event handling</li>
      </ul>
    </div>
  `;

  // Add click handlers for navigation
  main.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('href')!;
      history.pushState(null, '', path);
      handleNavigation();
      
      // Update active state in navigation
      document.querySelectorAll('.navigation a').forEach(a => 
        a.className = (a as HTMLAnchorElement).href === window.location.href ? 'active' : ''
      );
    });
  });
}
