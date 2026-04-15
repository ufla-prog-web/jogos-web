export const gameBackground = new URL("./background.png", import.meta.url).href;
export const birdFrame0 = new URL("./bird-0.png", import.meta.url).href;
export const birdFrame1 = new URL("./bird-1.png", import.meta.url).href;
export const birdFrame2 = new URL("./bird-2.png", import.meta.url).href;
export const pipeSprite = new URL("./pipe.png", import.meta.url).href;

export const birdFrames = [birdFrame0, birdFrame1, birdFrame2];

export const gameIcons = {
  background: gameBackground,
  birdFrames,
  pipe: pipeSprite,
};
