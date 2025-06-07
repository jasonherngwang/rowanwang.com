"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Toy from "./Toy";
import toyDefinitions, {
  ToyDefinition,
  Interaction,
  DragInteractionConfig,
  ClickInteractionConfig,
  ToggleOnClickInteractionConfig,
} from "../data/toy-definitions";
import { useToyInteractions } from "../hooks/use-toy-interactions";

interface ToyItem extends ToyDefinition {
  currentPosition: { x: number; y: number };
  currentScale: number;
}

export default function PlayArea() {
  const [toys, setToys] = useState<ToyItem[]>([]);
  const playAreaRef = useRef<HTMLDivElement>(null);

  // Scatter toys on initial mount and regenerate positions on window resize.
  useEffect(() => {
    const scatterToys = () => {
      const newToys = toyDefinitions.map((toyDef) => {
        if (playAreaRef.current) {
          const playAreaRect = playAreaRef.current.getBoundingClientRect();
          const toyWidth =
            typeof toyDef.size.width === "number"
              ? toyDef.size.width
              : parseInt(String(toyDef.size.width));
          const toyHeight =
            typeof toyDef.size.height === "number"
              ? toyDef.size.height
              : parseInt(String(toyDef.size.height));
          // Base width used for scaling calculations, allows toys to scale down on smaller screens.
          const baseWidth = 1024;
          // Scale factor ensures toys are reasonably sized relative to the play area, with a minimum scale.
          const scale = Math.min(1, playAreaRect.width / baseWidth) * 0.8 + 0.2;
          const x = Math.random() * (playAreaRect.width - toyWidth * scale);
          const y = Math.random() * (playAreaRect.height - toyHeight * scale);
          return { ...toyDef, currentPosition: { x, y }, currentScale: scale };
        }
        return { ...toyDef, currentPosition: { x: 0, y: 0 }, currentScale: 1 };
      });
      setToys(newToys);
    };

    if (playAreaRef.current) scatterToys();
    const handleResize = () => {
      if (playAreaRef.current) scatterToys();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ToyWrapper encapsulates the state and interaction logic for a single toy.
  interface ToyWrapperProps {
    toyItemData: ToyItem;
    constraintsRef: React.RefObject<HTMLDivElement | null>;
  }

  const ToyWrapper: React.FunctionComponent<ToyWrapperProps> = ({
    toyItemData,
    constraintsRef,
  }) => {
    const { currentImageSrc, setCurrentImageSrc, playSound, stopSound } =
      useToyInteractions(toyItemData);

    const [isBeingDragged, setIsBeingDragged] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Refs for continuous drag animations (e.g., rattle)
    const continuousAnimationIntervalIdRef = useRef<NodeJS.Timeout | null>(
      null
    );
    const continuousAnimationFrameIndexRef = useRef(0);

    // Ref for toggle animation
    const toggleAnimationIntervalIdRef = useRef<NodeJS.Timeout | null>(null);

    // Find specific interaction configurations
    const getDragConfig = useCallback((): DragInteractionConfig | undefined => {
      return toyItemData.interactions.find(
        (interaction): interaction is DragInteractionConfig =>
          interaction.type === Interaction.DRAG
      );
    }, [toyItemData.interactions]);

    const getClickConfig = useCallback(():
      | ClickInteractionConfig
      | undefined => {
      return toyItemData.interactions.find(
        (interaction): interaction is ClickInteractionConfig =>
          interaction.type === Interaction.CLICK
      );
    }, [toyItemData.interactions]);

    const getToggleConfig = useCallback(():
      | ToggleOnClickInteractionConfig
      | undefined => {
      return toyItemData.interactions.find(
        (interaction): interaction is ToggleOnClickInteractionConfig =>
          interaction.type === Interaction.TOGGLE_ON_CLICK
      );
    }, [toyItemData.interactions]);

    const clickConfig = getClickConfig();
    const hasVisualClickAnimation = !!(
      clickConfig?.animationOnClick?.images &&
      clickConfig.animationOnClick.images.length > 0
    );

    // Cleanup animations on unmount or when toy changes
    useEffect(() => {
      return () => {
        if (continuousAnimationIntervalIdRef.current) {
          // For drag animations
          clearInterval(continuousAnimationIntervalIdRef.current);
        }
        if (toggleAnimationIntervalIdRef.current) {
          clearInterval(toggleAnimationIntervalIdRef.current);
        }
      };
    }, []);

    const handlePointerDown = () => {
      const dragConfig = getDragConfig();
      // Play drag start sound only if it's configured and distinct from click sound handled below
      // This avoids double sound if drag starts immediately after a click interaction starts
      if (dragConfig?.soundOnDragStart) {
        // Consider if this should be delayed or contingent on actual drag movement
        // playSound(dragConfig.soundOnDragStart);
      }

      // Handle "pressed" state for click interactions immediately
      if (clickConfig) {
        if (clickConfig.soundOnClick) {
          playSound(clickConfig.soundOnClick); // Play sound on press
        }
        if (
          clickConfig.animationOnClick &&
          clickConfig.animationOnClick.images.length > 0
        ) {
          // Show the first frame of animation as "pressed" state
          setCurrentImageSrc(clickConfig.animationOnClick.images[0]);
        }
      }
      // Note: imageWhileDragging is handled in handleDragStart to ensure it only applies during actual drag motion
    };

    const handleDragStart = () => {
      setIsBeingDragged(true);
      const dragConfig = getDragConfig();

      if (dragConfig?.imageWhileDragging) {
        setCurrentImageSrc(dragConfig.imageWhileDragging);
      } else if (
        dragConfig?.animationWhileDragging &&
        dragConfig.animationWhileDragging.images.length > 0
      ) {
        // Start continuous animation
        if (continuousAnimationIntervalIdRef.current)
          clearInterval(continuousAnimationIntervalIdRef.current);
        continuousAnimationFrameIndexRef.current = 0;

        const { images, sound } = dragConfig.animationWhileDragging;
        // TODO: Make animationFrameDuration configurable per toy in ToyDefinition if needed
        const animationFrameDuration = 150;

        const animateContinuously = () => {
          setCurrentImageSrc(images[continuousAnimationFrameIndexRef.current]);
          if (sound) {
            playSound(sound);
          }
          continuousAnimationFrameIndexRef.current =
            (continuousAnimationFrameIndexRef.current + 1) % images.length;
        };

        animateContinuously(); // Play first frame immediately
        continuousAnimationIntervalIdRef.current = setInterval(
          animateContinuously,
          animationFrameDuration
        );
      }
      // dragConfig.soundOnDragStart is handled by handlePointerDown
    };

    const handleDragEnd = () => {
      setIsBeingDragged(false);
      setCurrentImageSrc(toyItemData.imageSrc); // Revert to base image

      // Stop continuous animation if it was running
      if (continuousAnimationIntervalIdRef.current) {
        clearInterval(continuousAnimationIntervalIdRef.current);
        continuousAnimationIntervalIdRef.current = null;
      }
      continuousAnimationFrameIndexRef.current = 0; // Reset frame index

      const dragConfig = getDragConfig();
      if (dragConfig?.soundOnDragEnd) {
        playSound(dragConfig.soundOnDragEnd);
      }
    };

    const handleTap = () => {
      // This fires on pointer up if no drag occurred
      if (isBeingDragged) return;

      const toggleConfig = getToggleConfig();
      if (toggleConfig) {
        setIsActive((prev) => !prev);
        return;
      }

      if (clickConfig) {
        // Sound was played on pointer down.
        // Revert the image to the second frame of the animation (if defined), or the base image.
        if (
          clickConfig.animationOnClick &&
          clickConfig.animationOnClick.images.length > 1
        ) {
          setCurrentImageSrc(clickConfig.animationOnClick.images[1]);
        } else if (
          clickConfig.animationOnClick &&
          clickConfig.animationOnClick.images.length === 1
        ) {
          // If animationOnClick only defined one frame (the pressed state), revert to original base image.
          if (currentImageSrc !== toyItemData.imageSrc) {
            // Avoid unnecessary state update if already base
            setCurrentImageSrc(toyItemData.imageSrc);
          }
        } else {
          // No animationOnClick, or it has no images. Revert to base if it somehow changed.
          if (currentImageSrc !== toyItemData.imageSrc) {
            setCurrentImageSrc(toyItemData.imageSrc);
          }
        }
      }
    };

    // useEffect for TOGGLE_ON_CLICK (e.g., piano)
    useEffect(() => {
      const toggleConfig = getToggleConfig();
      if (!toggleConfig) return;

      if (isActive) {
        // Start animation and sound
        playSound(toggleConfig.sound, toggleConfig.loopSound);

        const { animationImages } = toggleConfig;
        if (animationImages.length === 0) return;

        let frameIndex = 0;
        // TODO: Make this configurable
        const animationFrameDuration = 500;

        const animate = () => {
          frameIndex = (frameIndex + 1) % animationImages.length;
          setCurrentImageSrc(animationImages[frameIndex]);
        };

        // Set initial frame and start interval
        setCurrentImageSrc(animationImages[0]);
        toggleAnimationIntervalIdRef.current = setInterval(
          animate,
          animationFrameDuration
        );
      } else {
        // Stop animation and sound
        stopSound(toggleConfig.sound);

        if (toggleAnimationIntervalIdRef.current) {
          clearInterval(toggleAnimationIntervalIdRef.current);
          toggleAnimationIntervalIdRef.current = null;
        }
        // Revert to base image
        setCurrentImageSrc(toyItemData.imageSrc);
      }

      // Cleanup function
      return () => {
        if (toggleConfig.sound) {
          stopSound(toggleConfig.sound);
        }
        if (toggleAnimationIntervalIdRef.current) {
          clearInterval(toggleAnimationIntervalIdRef.current);
        }
      };
    }, [
      isActive,
      getToggleConfig,
      playSound,
      stopSound,
      setCurrentImageSrc,
      toyItemData.imageSrc,
    ]);

    return (
      <Toy
        initialPosition={toyItemData.currentPosition}
        scale={toyItemData.currentScale}
        imageSrc={currentImageSrc}
        altText={toyItemData.altText}
        size={toyItemData.size}
        baseZIndex={toyItemData.baseZIndex}
        dragConstraintsRef={constraintsRef}
        onToyDragStart={handleDragStart}
        onToyDragEnd={handleDragEnd}
        onTap={handleTap}
        onToyPointerDown={handlePointerDown}
        hasVisualClickAnimation={hasVisualClickAnimation}
      />
    );
  };

  return (
    <div
      ref={playAreaRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {toys.map((toy) => (
        <ToyWrapper
          key={toy.id}
          toyItemData={toy}
          constraintsRef={playAreaRef}
        />
      ))}
    </div>
  );
}
