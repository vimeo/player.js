import Player from '@vimeo/player';

export function initCustomColorsPage() {
  const config = {
    videoId: 76979871,
    colors: {
      primary: 'ffafef',
      accent: 'ff0000',
      text: '00ff00',
    }
  };

  const main = document.querySelector('main')!;
  main.innerHTML = `
    <div class="example-page">
      <h1>Custom Colors Example</h1>
      <p>Player with custom color scheme</p>
      <div id="player"></div>
      <div class="color-info">
        <p>Primary: <span style="color: #${config.colors.primary}">■</span> ${config.colors.primary}</p>
        <p>Accent: <span style="color: #${config.colors.accent}">■</span> ${config.colors.accent}</p>
        <p>Text/Icon: <span style="color: #${config.colors.text}">■</span> ${config.colors.text}</p>
      </div>
    </div>
  `;

  new Player('player', {
    id: config.videoId,
    responsive: true,
    colors: [config.colors.primary, config.colors.accent, config.colors.text]
  });
}
