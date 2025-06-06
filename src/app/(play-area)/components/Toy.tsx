import React from "react";
import { motion, PanInfo, AnimationDefinition } from "framer-motion";

// This interface defines the props for the Toy component.
// It includes properties for visual appearance, drag behavior, and event handling.
interface ToyProps {
  imageSrc: string; // Current image to display for the toy.
  initialPosition: { x: number; y: number }; // Initial coordinates on the PlayArea.
  size: { width: number | string; height: number | string }; // Dimensions of the toy.
  altText: string; // Accessibility text for the image.
  scale?: number; // Optional scaling factor, defaults to 1.
  baseZIndex?: number; // Base z-index for stacking order, can be overridden by interactions.
  // Ref to the parent element that constrains dragging, typically the PlayArea.
  dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
  // Event handlers passed down from ToyWrapper to manage specific interaction logic.
  onToyPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onToyPointerUp?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onToyDragStart?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  onToyDragEnd?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  // Callback for when Framer Motion animations (like inertia) complete.
  onToyAnimationComplete?: (definition?: AnimationDefinition) => void;
  // Generic tap/click handler.
  onTap?: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  hasVisualClickAnimation?: boolean; // New prop
}

// The Toy component is a presentational component responsible for rendering a single draggable toy.
// It uses Framer Motion for drag-and-drop functionality and animations.
const Toy: React.FC<ToyProps> = ({
  imageSrc,
  initialPosition,
  size,
  altText,
  scale = 1,
  baseZIndex,
  dragConstraintsRef,
  onToyPointerDown,
  onToyPointerUp,
  onToyDragStart,
  onToyDragEnd,
  onToyAnimationComplete,
  onTap,
  hasVisualClickAnimation,
}) => {
  // Calculate scaled dimensions, supporting both numeric (pixels) and string (e.g., 'vw') sizes.
  const scaledWidth =
    typeof size.width === "number"
      ? `${size.width * scale}px`
      : `calc(${size.width} * ${scale})`;
  const scaledHeight =
    typeof size.height === "number"
      ? `${size.height * scale}px`
      : `calc(${size.height} * ${scale})`;

  return (
    <motion.div
      drag // Enables dragging for this element.
      dragConstraints={dragConstraintsRef} // Restricts dragging within the bounds of the referenced element.
      // Defines the physics of the drag release (inertia) and boundary bounce.
      dragTransition={{
        bounceStiffness: 300, // How stiff the bounce is when hitting constraints.
        bounceDamping: 20, // How much the bounce is dampened.
        power: 0.1, // Lower power means less influence of initial velocity on the throw distance.
        timeConstant: 250, // Duration of the inertia animation.
      }}
      initial={{
        x: initialPosition.x,
        y: initialPosition.y,
        rotate: 0, // Start with no rotation.
      }}
      style={{
        position: "absolute", // Necessary for x, y positioning within the PlayArea.
        width: scaledWidth,
        height: scaledHeight,
        zIndex: baseZIndex ?? "auto", // Default z-index, can be overridden by whileTap.
        pointerEvents: "auto", // Ensures the toy can be interacted with.
      }}
      className="cursor-grab active:cursor-grabbing" // Visual cues for draggability.
      // Animations applied while the toy is being tapped/clicked or hovered.
      whileTap={hasVisualClickAnimation 
        ? { zIndex: (baseZIndex ?? 20) + 1 } 
        : { scale: 1.1, zIndex: (baseZIndex ?? 20) + 1 }
      }
      whileHover={{ scale: 1.05 }} // Slightly enlarge on hover.
      // Forwarding Framer Motion and pointer events to handlers in ToyWrapper.
      onPointerDown={onToyPointerDown}
      onPointerUp={onToyPointerUp}
      onDragStart={onToyDragStart}
      onDragEnd={onToyDragEnd}
      onAnimationComplete={onToyAnimationComplete}
      onTap={onTap}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={altText}
        style={{ width: "100%", height: "100%", display: "block" }}
        draggable="false" // Prevents native browser image dragging interference.
      />
    </motion.div>
  );
};

export default Toy;
