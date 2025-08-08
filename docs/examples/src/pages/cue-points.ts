import Player from '@vimeo/player';
import { PlayerEvent, CuePointEvent, ChapterChangeEvent } from '@vimeo/player-types/events';

type CustomCuePointData = {
  text: string;
}

export function initCuePointsPage() {
  const videoId = 76979871;
  const cuePoints: Array<{ time: number; data: CustomCuePointData }> = [
    { time: 5, data: { text: 'First cue point at 5 seconds' } },
    { time: 10, data: { text: 'Second cue point at 10 seconds' } },
    { time: 15, data: { text: 'Third cue point at 15 seconds' } }
  ];

  const main = document.querySelector('main')!;
  main.innerHTML = `
    <div class="example-page">
      <h1>Cue Points Example</h1>
      <p>Watch as different actions trigger at specific timestamps (5s, 10s, 15s)</p>
      <div id="player"></div>
      <div id="cue-point-log"></div>
    </div>
  `;

  const player = new Player('player', {
    id: videoId,
    responsive: true,
  });

  const log = document.getElementById('cue-point-log')!;
  log.style.marginTop = '1rem';
  log.style.padding = '1rem';
  log.style.backgroundColor = '#f5f5f5';
  log.style.borderRadius = '4px';
  log.innerHTML = '<h3>Cue Point Log:</h3>';

  // Add cue points
  cuePoints.forEach(cuePoint => {
    player.addCuePoint(cuePoint.time, cuePoint.data);
  });

  // Listen for cue points
  player.on(PlayerEvent.CuePoint, (event: CuePointEvent<CustomCuePointData>) => {
    const entry = document.createElement('p');
    entry.textContent = `✓ ${event.data.text}`;
    entry.style.color = '#00adef';
    log.appendChild(entry);
  });
}
