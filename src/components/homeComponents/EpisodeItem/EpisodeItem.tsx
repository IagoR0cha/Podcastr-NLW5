import Image from 'next/image';
import Link from 'next/link';

import { EpisodeData } from '../../../pages';

import styles from './styles.module.scss';

interface Props {
  episode: EpisodeData;
  onPlay: (episode: EpisodeData) => void;
}

export function EpisodeItem({ episode, onPlay }: Props) {
  return (
    <tr className={styles.container}>
      <td style={{ width: 72 }}>
        <Image
          width={120}
          height={120}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />
      </td>
      <td>
        <Link href={`/episode/${episode.id}`}>
          <a>{episode.title}</a>
        </Link>
      </td>
      <td>{episode.members}</td>
      <td style={{ width: 100 }}>{episode.publishedAt}</td>
      <td>{episode.durationAsString}</td>
      <td>
        <button type="button" onClick={() => onPlay(episode)}>
          <Image
            height={120}
            width={120}
            src="/play-green.svg"
            alt="Tocar episódio"
          />
        </button>
      </td>
    </tr>
  )
}