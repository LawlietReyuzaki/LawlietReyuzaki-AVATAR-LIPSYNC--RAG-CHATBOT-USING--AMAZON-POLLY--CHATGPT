// import { Environment, OrbitControls, useTexture } from "@react-three/drei";
// import { useThree } from "@react-three/fiber";
// import { Avatar } from "./Avatar1";

// export const Experience = ({playAudio}) => {
//   const texture = useTexture("textures/background.PNG");
//   const viewport = useThree((state) => state.viewport);
//   if(playAudio){
//     alert("in experience play audio postive!");
//   }else{
//     alert("in experience play audio negative!");
//   }

//   return (
//     <>
//       <OrbitControls />
//       <Avatar position={[0, -3, 5]} scale={2} playAudio={playAudio} />
//       <Environment preset="sunset" />
//       <mesh>
//         <planeGeometry args={[viewport.width, viewport.height]} />
//         <meshBasicMaterial map={texture} />
//       </mesh>
//     </>
//   );
// };
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { useState } from "react";

export const Experience = ({ playAudio, script}) => {
  const texture = useTexture("textures/background.PNG");
  const viewport = useThree((state) => state.viewport);
  const [audioKey, setAudioKey] = useState(0); // State to track audio invocations

  // if (playAudio) {
  //   alert("in experience play audio positive!");
  // } else {
  //   alert("in experience play audio negative!");
  // }

  const handlePlayAudioChange = () => {
    // Update playAudio state here if you have a function to do so
    // After updating, change the audioKey to remount Avatar
    setAudioKey(prev => prev + 1); // Incrementing key to remount Avatar
  };

  return (
    <>
      <OrbitControls />
      <Avatar key={audioKey} position={[-10, -7, -100]} scale={[20, 20, 3]} playAudio={playAudio} jawab = {script} />
      <Environment preset="sunset" />

    </>
  );
};
