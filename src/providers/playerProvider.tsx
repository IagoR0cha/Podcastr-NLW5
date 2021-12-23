import { useContext, createContext, ReactElement, useState } from "react";
import { EpisodeData } from "../pages";


type PlayerContext = {
  episodeList: EpisodeData[];
  currentEpisodeIndex: number | null;
  play: (episode: EpisodeData) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  setIsPlaying: (status: boolean) => void;
  playList: (list: EpisodeData[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  toggleLoop: () => void;
  isLooping: boolean;
  toggleShuffle: () => void;
  isShuffling: boolean;
  clearPlayerState: () => void;
}

type Props = {
  children: ReactElement;
}

export const PlayerContext = createContext<PlayerContext>({} as PlayerContext)

function PlayerProvider({ children }: Props) {
  const [episodeList, setEpisodeList] = useState<EpisodeData[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episodePlayed: EpisodeData) {
    setEpisodeList([episodePlayed]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: EpisodeData[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      isPlaying,
      togglePlay,
      setIsPlaying,
      playList,
      playNext,
      playPrevious,
      hasPrevious,
      hasNext,
      toggleLoop,
      isLooping,
      toggleShuffle,
      isShuffling,
      clearPlayerState
    }}>
      { children }
    </PlayerContext.Provider>
  );
}

function usePlayer() {
  return useContext(PlayerContext);
}

export {
  PlayerProvider,
  usePlayer
}