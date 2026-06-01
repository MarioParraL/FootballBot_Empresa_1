import { useRef, useState } from "preact/hooks";

type Props = {
  summaries: string[];
};

export default function GlobalAudioPlayer(props: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [loading, setLoading] = useState(false);

  const playAll = async () => {
    try {
      setLoading(true);

      for (const summary of props.summaries) {
        const res = await fetch("/api/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: summary,
          }),
        });

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (!audioRef.current) continue;

        audioRef.current.src = url;

        await audioRef.current.play();

        await new Promise<void>((resolve) => {
          if (!audioRef.current) {
            resolve();
            return;
          }

          audioRef.current.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="audio-player">
      <button
        class="audio-btn"
        onClick={playAll}
        disabled={loading}
      >
        {loading ? "Reproduciendo noticias" : "Escuchar todas las noticias"}
      </button>

      <audio controls ref={audioRef}></audio>
    </div>
  );
}
