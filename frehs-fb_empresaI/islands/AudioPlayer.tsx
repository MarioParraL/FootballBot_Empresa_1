import { useRef, useState } from "preact/hooks";

type Props = {
  summary: string;
};

export default function AudioPlayer(props: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [loading, setLoading] = useState(false);

  const generateAudio = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: props.summary,
        }),
      });

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="audio-player">
      <button
        class="audio-btn"
        onClick={generateAudio}
        disabled={loading}
      >
        {loading ? "Generando audio" : "Escuchar noticia"}
      </button>

      <audio controls ref={audioRef}></audio>
    </div>
  );
}
