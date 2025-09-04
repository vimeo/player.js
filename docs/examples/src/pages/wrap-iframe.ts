import Player from '@vimeo/player';

export function initWrapIframe() {
  const config = {
    videoId: 76979871,
  };

  const main = document.querySelector('main')!;
  main.innerHTML = `
    <div class="example-page">
      <h1>Wrap Iframe Example</h1>
      <p>Load the Vimeo Player SDK from an existing iframe.</p>
      <div id="player-container">
        <div id="player">
          <iframe id="player-iframe" src="https://player.vimeo.com/video/${config.videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;

  let player: Player | null = null;

  if (!player) {
    const iframe = document.getElementById('player-iframe')!;
    
    player = new Player(iframe, {
      responsive: true,
    });
  }
}
