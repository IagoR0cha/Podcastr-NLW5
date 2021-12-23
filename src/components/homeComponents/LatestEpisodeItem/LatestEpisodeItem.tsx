import Image from 'next/image';
import Link from 'next/link';

import { EpisodeData } from '../../../pages';

import styles from './styles.module.scss';

interface Props {
  episode: EpisodeData;
  onPlay: (episode: EpisodeData) => void;
}

export function LatestEpisodeItem({ episode, onPlay }: Props) {
  return (
    <li className={styles.container}>
      <Image
        src={episode.thumbnail}
        alt={episode.title}
        width={192}
        height={192}
        objectFit="cover"
      />
      <div className={styles.episodeDetails}>
        <Link href={`/episode/${episode.id}`}>
          <a>{episode.title}</a>
        </Link>
        <p>{episode.members}</p>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </div>
      <button type="button" onClick={() => onPlay(episode)}>
        <Image
          src={'/play-green.svg'}
          alt="Tocar episódio"
          width={192}
          height={192}
        />
      </button>
    </li>
  );
}