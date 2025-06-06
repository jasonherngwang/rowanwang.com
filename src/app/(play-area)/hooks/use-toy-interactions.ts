import { ToyDefinition, Interaction } from "../data/toy-definitions";
import { useState, useEffect, useCallback } from "react";

export interface ToyActionsAndState {
  currentImageSrc: string;
  setCurrentImageSrc: React.Dispatch<React.SetStateAction<string>>;
  playSound: (soundSrc?: string) => void;
}

export const useToyInteractions = (toy: ToyDefinition): ToyActionsAndState => {
  const [currentImageSrc, setCurrentImageSrc] = useState(toy.imageSrc);
  const [audioElements, setAudioElements] = useState<
    Map<string, HTMLAudioElement>
  >(new Map());

  useEffect(() => {
    setCurrentImageSrc(toy.imageSrc);

    const soundSources = new Set<string>();
    toy.interactions.forEach((interaction) => {
      if (interaction.type === Interaction.DRAG) {
        if (interaction.soundOnDragStart)
          soundSources.add(interaction.soundOnDragStart);
        if (interaction.soundOnDragEnd)
          soundSources.add(interaction.soundOnDragEnd);
        if (interaction.animationWhileDragging?.sound)
          soundSources.add(interaction.animationWhileDragging.sound);
      } else if (interaction.type === Interaction.CLICK) {
        if (interaction.soundOnClick)
          soundSources.add(interaction.soundOnClick);
        if (interaction.animationOnClick?.sound)
          soundSources.add(interaction.animationOnClick.sound);
      } else if (interaction.type === Interaction.TOGGLE_ON_CLICK) {
        if (interaction.sound) soundSources.add(interaction.sound);
      }
    });

    const newAudioElements = new Map<string, HTMLAudioElement>();
    soundSources.forEach((src) => {
      const newAudio = new Audio(src);
      newAudio.preload = "auto";
      newAudioElements.set(src, newAudio);
    });

    audioElements.forEach((audioEl) => audioEl.pause());
    setAudioElements(newAudioElements);

    return () => {
      newAudioElements.forEach((audioEl) => audioEl.pause());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toy]);

  const playSound = useCallback(
    (soundSrc?: string) => {
      if (!soundSrc) {
        return;
      }
      const soundToPlay = audioElements.get(soundSrc);

      if (soundToPlay) {
        soundToPlay.currentTime = 0;
        soundToPlay.play().catch((error) => {
          if (error.name === "NotSupportedError") {
            console.log(
              `Audio play failed for ${toy.name} (source: ${soundSrc}): Source not supported or file missing.`
            );
          } else {
            console.error(
              `Error playing sound for ${toy.name} (source: ${soundSrc}):`,
              error
            );
          }
        });
      } else {
        console.warn(
          `Sound source "${soundSrc}" not preloaded for toy ${toy.name}. Available sources:`,
          Array.from(audioElements.keys())
        );
      }
    },
    [audioElements, toy.name]
  );

  return {
    currentImageSrc,
    setCurrentImageSrc,
    playSound,
  };
};
