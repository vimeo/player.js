import Player from '@vimeo/player';

export function initLazyLoadPage() {
  const config = {
    videoId: 76979871,
    thumbnailUrl: 'https://i.vimeocdn.com/video/452001751-918fbb3bde0df4a38c29dd54137fda2ad87842f4626776fe6_640'
  };

  const main = document.querySelector('main')!;
  main.innerHTML = `
    <div class="example-page">
      <h1>Lazy Loading Example</h1>
      <p>Click on the thumbnail to load and play the video.</p>
      <p>This can help improve performance by only loading the player once it's needed.</p>
      <div id="player-container" data-player="false">
        <img src="${config.thumbnailUrl}" alt="Video thumbnail" id="thumbnail">
        <div class="play-button"></div>
        <div id="player"></div>
      </div>
    </div>
  `;

  const thumbnail = document.getElementById('thumbnail')!;
  let player: Player | null = null;

  thumbnail.addEventListener('click', async () => {
    if (!player) {
      const container = document.getElementById('player-container')!;
      container.dataset.player = 'true';
      
      player = new Player('player', {
        id: config.videoId,
        responsive: true,
      });

      await player.ready();
      player.play();
    }
  });
}
