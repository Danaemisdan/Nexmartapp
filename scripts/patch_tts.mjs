import fs from 'fs';

// 1. Patch AgentOrb.tsx to properly clear audio queue on interrupt
const agentOrbFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentOrb = fs.readFileSync(agentOrbFile, 'utf8');

agentOrb = agentOrb.replace(
  /const stopTalking = \(\) => \{\s*if \(audioRef\.current\) \{\s*audioRef\.current\.pause\(\);\s*audioRef\.current\.currentTime = 0;\s*\}\s*\};/,
  `const stopTalking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioQueue.current = [];
    isPlayingAudio.current = false;
    setWorkflowState('IDLE');
  };`
);

fs.writeFileSync(agentOrbFile, agentOrb);

// 2. Patch TTS API route to increase speech rate by +15%
const ttsRouteFile = '/Users/sanjeevn/Downloads/nexmart/src/app/api/tts/route.ts';
let ttsRoute = fs.readFileSync(ttsRouteFile, 'utf8');

ttsRoute = ttsRoute.replace(
  "const { audioStream } = tts.toStream(text);",
  "const { audioStream } = tts.toStream(text, { rate: '+15%' });"
);

fs.writeFileSync(ttsRouteFile, ttsRoute);

console.log("Patched speech interruptions and TTS speaking rate!");
