export enum Interaction {
  DRAG = "DRAG",
  CLICK = "CLICK",
  TOGGLE_ON_CLICK = "TOGGLE_ON_CLICK",
}

export interface DragInteractionConfig {
  type: Interaction.DRAG;
  soundOnDragStart?: string;
  soundOnDragEnd?: string;
  imageWhileDragging?: string;
  animationWhileDragging?: {
    images: string[]; // e.g., [frame1, frame2, baseImage]
    sound?: string; // Sound to play continuously or per frame while dragging
  };
}

export interface ClickInteractionConfig {
  type: Interaction.CLICK;
  soundOnClick?: string;
  animationOnClick?: {
    images: string[];
    sound?: string;
  };
}

export interface ToggleOnClickInteractionConfig {
  type: Interaction.TOGGLE_ON_CLICK;
  sound: string;
  animationImages: string[];
  loopSound?: boolean;
  // loopAnimation?: boolean; // Future consideration
}

export interface ToyDefinition {
  id: string;
  name: string;
  imageSrc: string; // Base image of the toy
  size: { width: number | string; height: number | string };
  altText: string;
  baseZIndex?: number;
  interactions: (
    | DragInteractionConfig
    | ClickInteractionConfig
    | ToggleOnClickInteractionConfig
  )[];
}

// To add a new toy, define it here and ensure assets are in the /public folder.
const toyDefinitions: ToyDefinition[] = [
  {
    id: "rattle",
    name: "Rattle",
    imageSrc: "/assets/toys/rattle.png",
    size: { width: 200, height: 200 },
    altText: "Rowan's music instrument",
    baseZIndex: 20,
    interactions: [
      { type: Interaction.DRAG,
        animationWhileDragging: {
          images: [
            // Note: imageSrc is the base. These are the animation cycle.
            "/assets/toys/rattle_right.png",
            "/assets/toys/rattle_left.png",
          ],
          sound: "/assets/sounds/rattle.mp3",
        }
      }
    ],
  },
  // {
  //   id: "piano1",
  //   name: "Kick-and-Play Piano",
  //   imageSrc: "/assets/toys/piano.png",
  //   size: { width: 200, height: 120 },
  //   altText: "A kick-and-play piano toy",
  //   baseZIndex: 20,
  //   interactions: [
  //     { type: Interaction.DRAG }, // Allow dragging
  //     {
  //       type: Interaction.TOGGLE_ON_CLICK,
  //       sound: "/assets/sounds/piano-music.mp3",
  //       animationImages: [
  //         "/assets/toys/piano.png", // Base image
  //         "/assets/toys/piano-light1.png",
  //         "/assets/toys/piano-light2.png",
  //         "/assets/toys/piano-light3.png",
  //       ],
  //       loopSound: true,
  //     },
  //   ],
  // },
  {
    id: "camel",
    name: "Camel",
    imageSrc: "/assets/toys/camel.png",
    size: { width: 220, height: 220 },
    altText: "A plush camel toy",
    baseZIndex: 20,
    interactions: [
      {
        type: Interaction.DRAG,
        soundOnDragStart: "/assets/sounds/cartoon_squeak.mp3",
        soundOnDragEnd: "/assets/sounds/beanbag_drop.mp3",
      },
      {
        type: Interaction.CLICK,
        soundOnClick: "/assets/sounds/cartoon_squeak.mp3",
      },
    ],
  },
  {
    id: "seal",
    name: "Seal",
    imageSrc: "/assets/toys/seal.png", // Normal image
    size: { width: 400, height: 400 },
    altText: "A fat plush seal toy",
    baseZIndex: 20,
    interactions: [
      {
        type: Interaction.DRAG,
        soundOnDragStart: "/assets/sounds/toy_squeeze.mp3",
        soundOnDragEnd: "/assets/sounds/thud.mp3",
        imageWhileDragging: "/assets/toys/seal_squish.png", // Squished image during drag
      },
      {
        type: Interaction.CLICK,
        soundOnClick: "/assets/sounds/toy_squeeze.mp3",
        // Optional: For a quick squish-and-revert animation on click:
        animationOnClick: {
          images: ["/assets/toys/seal_squish.png", "/assets/toys/seal.png"],
        }
      },
    ],
  },
];

export default toyDefinitions;
