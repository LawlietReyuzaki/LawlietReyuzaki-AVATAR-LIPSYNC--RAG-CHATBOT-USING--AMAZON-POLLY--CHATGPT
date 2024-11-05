import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, {useEffect, useMemo, useRef, useState } from "react";
import './Chatbot.css'; // Import CSS for styling
import { saveAs } from "file-saver";
//import axios from 'axios';





// Configure AWS credentials and Polly settings

import * as THREE from "three";

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};



export function Avatar(props) {

let { position, scale, playAudio, jawab } = props;
let [updateCount, setUpdateCount] = useState(0);

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance(jawab);

// Optional: Configure speech properties like rate, pitch, and voice
utterance.rate = 1; // Speed of the voice
utterance.pitch = 1; // Pitch of the voice
utterance.volume = 0;


const greetingAudioRef = useRef(null);  // Use ref for the audio object
var greetingControlRef = useRef(false); // Use ref for the control
const greetingLipsyncRef = useRef(null); // Store lipsync data in ref

//animation with lipsync
const audioRef = useRef(null); // Ref to store the audio object
const [currentAudioTime, setCurrentAudioTime] = useState(0); // State to store current audio time


  // if(playAudio){
  //   alert("play audio postive!");
  // }else{
  //   alert("play audio negative!");
  // }

// State to handle user input and bot response
// const [userInput, setUserInput] = useState(""); // User input text
// const [botResponse, setBotResponse] = useState(""); // Bot response text
const [greetingControl, setGreetingControl] = useState(false);
// Controls for playAudio, headFollow, etc.
// var {
//   //playAudio ,
//   script,
//   headFollow,
//   smoothMorphTarget,
//   morphTargetSmoothing,
// } = useControls({
//   //playAudio: PlayAudio ,
//   headFollow: true,
//   smoothMorphTarget: true,
//   morphTargetSmoothing: 0.5,
//   script: {
//     value: "response",
//     options: ["welcome", "pizzas", "HassanKamran", "response"],
//   },
// });

var script = "response"; // Default value for script
var headFollow = false;    // Set headFollow to true
var smoothMorphTarget = true; // Set smoothMorphTarget to true
var morphTargetSmoothing = 0.5; // Set morphTargetSmoothing to 0.5

// You can now use these variables in your component logic



  let audio;
  let lipsync;

  let greeting_lipsync;
  let greeting_audio;
  


  /* 
  
  this is the added code for lip sync and tts
  
  */
  const responseAudioRef = useRef(null); // Ref for Jawab audio
  const responseLipsyncRef = useRef(null); // Ref for Jawab lipsync
  const responseControlRef = useRef(false); // Control for Jawab audio

  async function fetchAudio(text) {
    const response = await fetch('http://13.61.26.215/synthesize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate audio');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play the audio
    const audio = new Audio(audioUrl);
    audio.play();
}

  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };



  // const synthesizeAndPlay = async (Text) => {
  
  //   try {
  //     const response = await axios.post('http://13.61.26.215/synthesize', {
  //       text: Text,
  //     }, { responseType: 'arraybuffer' }); // Set responseType to arraybuffer
  
  //     //alert('fetched!');
      
  //     // Create a blob from the audio response
  //     const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const audio = new Audio(audioUrl);
  
  //     // Play the audio
  //     audio.play();
  
  //   } catch (error) {
  //     alert("Error playing audio");
  //     console.error('Error synthesizing speech:', error);
  //   }
  // };

  const synthesizeAndPlay = async (Text) => {
    try {
      const response = await fetch('http://13.61.26.215/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: Text }),
      });
  
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Get the response as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
  
      // Create a blob from the audio response
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
  
      // Play the audio
      audio.play();
  
    } catch (error) {
      alert("Error playing audio");
      console.error('Error synthesizing speech:', error);
    }
  };
  





  // Greeting Logic
  useEffect(() => {
    fetch(`./audios/welcome.json?cacheBust=${new Date().getTime()}`)
      .then((response) => response.json())
      .then((data) => {
        greetingLipsyncRef.current = data;  // Store greeting lip-sync
        const greetingAudio = new Audio(`./audios/welcome.mp3?cacheBust=${new Date().getTime()}`);
        greetingAudioRef.current = greetingAudio;
        greetingAudio.play();
        setAnimation('Greeting');  // Trigger greeting animation
        greetingControlRef.current = true;

        greetingAudio.onended = () => {
          setAnimation("Idle");
          greetingControlRef.current = false;
        };
      })
      .catch((error) => console.error("Failed to fetch greeting JSON:", error));

    return () => {
      if (greetingAudioRef.current) {
        greetingAudioRef.current.pause();
      }
    };
  }, []);  // Empty array to only run on mount (initial page load)

  // Jawab Logic (runs whenever 'playAudio' or 'jawab' changes)
  useEffect(() => {
    if (!playAudio) return;  // Don't fetch or play if not triggered

    fetch(`./audios/response.json?cacheBust=${new Date().getTime()}`)
      .then((response) => response.json())
      .then((data) => {
        responseLipsyncRef.current = data;  // Store response (jawab) lip-sync
        const responseAudio = new Audio(`./audios/response.mp3?cacheBust=${new Date().getTime()}`);
        responseAudioRef.current = responseAudio;
        responseAudio.volume = 0.0;
        setAnimation('Angry');  // Trigger speaking animation
        responseControlRef.current = true;

        //synthesizeAndPlay();
        //speakText("Hello, this is Amazon Polly speaking from a React app!");

        utterance.onstart = () => {
          //fetchAudio(jawab);
          
          //alert("hi");
          synthesizeAndPlay(jawab);

          //speakText("Hello, this is Amazon Polly speaking from a React app!");

          console.log("Speech has started.");
          responseAudio.play();

        };
        
        //responseAudio.play();

        utterance.onend = () => {
          responseAudio.pause();
          setAnimation("Idle");
          responseControlRef.current = false;
        };



        responseAudio.onended = () => {
          setAnimation("Idle");
          responseControlRef.current = false;
        };

       synth.speak(utterance);


      })
      .catch((error) => console.error("Failed to fetch response JSON:", error));

    return () => {
      if (responseAudioRef.current) {
        responseAudioRef.current.pause();
      }
    };
  }, [playAudio,script, jawab]);  // Respond to changes in `playAudio` and `jawab`

  // Lip-sync for both Greeting and Response
  useFrame(() => {
    // Greeting Lip-sync
    if (greetingControlRef.current && greetingAudioRef.current) {
      const currentAudioTime = greetingAudioRef.current.currentTime;
      const greetingLipsync = greetingLipsyncRef.current;
      if (greetingAudioRef.current.ended || !greetingLipsync) return;

      // Handle lip-sync morph targets for greeting
      Object.values(corresponding).forEach((value) => {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
      });

      for (let i = 0; i < greetingLipsync.mouthCues.length; i++) {
        const mouthCue = greetingLipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
          break;
        }
      }
    }

    // Jawab (response) Lip-sync
    if (responseControlRef.current && responseAudioRef.current) {
      const currentAudioTime = responseAudioRef.current.currentTime;
      const responseLipsync = responseLipsyncRef.current;
      if (responseAudioRef.current.ended || !responseLipsync) return;

      // Handle lip-sync morph targets for response (jawab)
      Object.values(corresponding).forEach((value) => {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
      });

      for (let i = 0; i < responseLipsync.mouthCues.length; i++) {
        const mouthCue = responseLipsync.mouthCues[i];
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
          break;
        }
      }
    }
  });

 


// The below is for when the website is initially loaded
    useFrame(() => {
      if (!greetingControlRef.current) return;
      
      const currentAudio = greetingAudioRef.current;  // Get audio from ref
      if (!currentAudio) return;  // Ensure audio exists


      const currentAudioTime = currentAudio.currentTime;
      if (currentAudio.ended || currentAudio.paused) {
        setAnimation("Idle");
        greetingControlRef.current = false;
        return;
      }
      
      Object.values(corresponding).forEach((value) => {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ] = 0;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ] = 0;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
              nodes.Wolf3D_Head.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );
  
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
              nodes.Wolf3D_Teeth.morphTargetDictionary[value]
            ],
            0,
            morphTargetSmoothing
          );
        }
      });
      const greeting_lipsync = greetingLipsyncRef.current;
      if (!greeting_lipsync) return;

      for (let i = 0; i < greeting_lipsync.mouthCues.length; i++) {
        const mouthCue = greeting_lipsync.mouthCues[i];
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          if (!smoothMorphTarget) {
            nodes.Wolf3D_Head.morphTargetInfluences[
              nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
            ] = 1;
            nodes.Wolf3D_Teeth.morphTargetInfluences[
              nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
            ] = 1;
          } else {
            nodes.Wolf3D_Head.morphTargetInfluences[
              nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
            ] = THREE.MathUtils.lerp(
              nodes.Wolf3D_Head.morphTargetInfluences[
                nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
              ],
              1,
              morphTargetSmoothing
            );
            nodes.Wolf3D_Teeth.morphTargetInfluences[
              nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
            ] = THREE.MathUtils.lerp(
              nodes.Wolf3D_Teeth.morphTargetInfluences[
                nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
              ],
              1,
              morphTargetSmoothing
            );
          }
          break;
        }
      }
    },[greetingControl , greeting_audio]);

   





  // This one controls greetings
  useEffect(() => {
    fetch(`./audios/welcome.json?cacheBust=${new Date().getTime()}`)
      .then((welcome) => {
        if (!welcome.ok) {
          throw new Error("Network response was not ok");
        }
        return welcome.json();
      })
      .then((data) => {
        greetingLipsyncRef.current = data;
 
        console.log(greeting_lipsync)
        greeting_audio = new Audio(`./audios/welcome.mp3?cacheBust=${new Date().getTime()}`);
        greetingAudioRef.current = greeting_audio;
        greeting_audio.play();
        
        setAnimation("Greeting");
        greetingControlRef.current = true;

        
        
      })    
      .catch((error) => console.error("Failed to fetch JSON file:", error));

      return () => {
        if (greetingAudioRef.current) {
          greetingAudioRef.current.pause();  // Clean up audio
        }
      };
    }, []);
  // const triggerUpdate = () => {
  //   setUpdateCount((prevCount) => prevCount + 1); // Increment to trigger effect
  // };


  const { nodes, materials } = useGLTF("/models/646d9dcdc8a5f5bddbfac913.glb");
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: angryAnimation } = useFBX("/animations/Angry Gesture.fbx");
  const { animations: greetingAnimation } = useFBX("/animations/Standing Greeting.fbx");
  //const { animations: yellingAnimation } = useFBX("/animations/Yelling.fbx");

  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  greetingAnimation[0].name = "Greeting";
  //yellingAnimation[0].name = "Yelling";
  const [animation, setAnimation] = useState("Idle");

  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], angryAnimation[0], greetingAnimation[0]],
    group
  );

  // useEffect(() => {
  //   actions[animation].reset().fadeIn(0.5).play();
  //   return () => actions[animation].fadeOut(0.5);
  // }, [animation]);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.0).play();
    if (animation === "Angry") {
      group.current.scale.y = -20;
    } else {
      group.current.scale.y = 20;
    }
    return () => actions[animation].fadeOut(0.0);
  }, [animation , actions]);

  // CODE ADDED AFTER THE TUTORIAL (but learnt in the portfolio tutorial ♥️)
  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName("Head").lookAt(state.camera.position);
    }
  });

  return (
    
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}





useGLTF.preload("/models/646d9dcdc8a5f5bddbfac913.glb");
