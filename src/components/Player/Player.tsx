import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../../providers/playerProvider';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/worksWithConvertTime';
import { getWindowDimensions } from '../../utils/worksWithDimensions';

export function Player() {
  const [progress, setProgress] = useState(0);

  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setIsPlaying,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    toggleShuffle,
    isShuffling,
    clearPlayerState
  } = usePlayer();

  const currentEpisode = episodeList[currentEpisodeIndex];

  const audiRef = useRef<HTMLAudioElement>(null);

  function setupProgressListener() {
    audiRef.current.currentTime = 0;

    audiRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audiRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audiRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  useEffect(() => {
    if (!audiRef.current) {
      return;
    }

    if (isPlaying) {
      audiRef.current.play();
    } else {
      audiRef.current.pause();
    }
  }, [isPlaying]);


  return (
    <div className={styles.playerContainer}>
      <header>
        <Image
          src="/playing.svg"
          alt="Tocando agora"
          width={'30%'}
          height={'30%'}
        />
        <strong>Tocando agora</strong>
      </header>
      {!currentEpisode ?
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
        :
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={currentEpisode.thumbnail}
            alt={currentEpisode.title}
            objectFit="cover"
          />
          <strong>{currentEpisode.title}</strong>
          <span>{currentEpisode.members}</span>
        </div>
      }

      <footer className={!currentEpisode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {!currentEpisode ?
              <div className={styles.emptySlider} />
              :
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                max={currentEpisode.duration}
                value={progress}
                onChange={handleSeek}
              />
            }
          </div>
          <span>{currentEpisode ? currentEpisode.durationAsString : '00:00'}</span>
        </div>
        {currentEpisode &&
          <audio
            ref={audiRef}
            src={currentEpisode.url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            loop={isLooping}
            autoPlay
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        }
        <div className={styles.buttons}>
          <button
            className={isShuffling ? styles.isActive : ''}
            type="button"
            disabled={!currentEpisode || episodeList.length === 1}
            onClick={toggleShuffle}
          >
            <Image
              height={80}
              width={80}
              src={"/shuffle.svg"}
              alt="Embaralhar"
            />
          </button>
          <button
            type="button"
            disabled={!currentEpisode || !hasPrevious}
            onClick={playPrevious}
          >
            <Image
              height={80}
              width={80}
              src={"/play-previous.svg"}
              alt="Tocar anterior"
            />
          </button>
          <button
            className={styles.playButton}
            type="button"
            disabled={!currentEpisode}
            onClick={togglePlay}
          >
            {isPlaying ?
              <Image
              height={80}
              width={80}
                src={"/pause.svg"}
                alt="Tocar"
              />
              :
              <Image
              height={80}
              width={80}
                src={"/play.svg"}
                alt="Tocar"
              />
            }
          </button>
          <button
            type="button"
            disabled={!currentEpisode || !hasNext}
            onClick={playNext}
          >
            <Image
              height={80}
              width={80}
              src={"/play-next.svg"}
              alt="Tocar próxima"
            />
          </button>
          <button
            className={isLooping ? styles.isActive : ''}
            type="button"
            disabled={!currentEpisode}
            onClick={toggleLoop}
          >
            <Image
              height={80}
              width={80}
              src={"/repeat.svg"}
              alt="Repetir"
            />
          </button>
        </div>
      </footer>
    </div>
  );
}