interface Route {
  path: string;
  title: string;
}

const routes: Route[] = [
  { path: '/', title: 'Home' },
  { path: '/lazy-load', title: 'Lazy Loading' },
  { path: '/cue-points', title: 'Cue Points' },
  { path: '/custom-colors', title: 'Custom Colors' },
  { path: '/react-wrapper', title: 'React Wrapper' }
];

export function initNavigation() {
  const nav = document.createElement('nav');
  nav.className = 'navigation';

  routes.forEach(route => {
    const link = document.createElement('a');
    link.href = route.path;
    link.textContent = route.title;
    link.className = location.pathname === route.path ? 'active' : '';
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', route.path);
      handleNavigation();
      
      // Update active state
      document.querySelectorAll('.navigation a').forEach(a => 
        a.className = (a as HTMLAnchorElement).href === link.href ? 'active' : ''
      );
    });
    
    nav.appendChild(link);
  });

  document.querySelector('.app')?.prepend(nav);
}

export function handleNavigation() {
  const path = location.pathname;
  
  // Dynamically import the correct module based on the path
  switch (path) {
    case '/':
      import('./pages/home').then(module => module.initHomePage());
      break;
    case '/lazy-load':
      import('./pages/lazy-load').then(module => module.initLazyLoadPage());
      break;
    case '/cue-points':
      import('./pages/cue-points').then(module => module.initCuePointsPage());
      break;
    case '/custom-colors':
      import('./pages/custom-colors').then(module => module.initCustomColorsPage());
      break;
    case '/react-wrapper':
      import('./pages/react-wrapper').then(module => module.initReactWrapperPage());
      break;
  }
}
