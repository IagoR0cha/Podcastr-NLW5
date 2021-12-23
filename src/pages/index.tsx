import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticProps } from "next"
import Head from 'next/head';

import { api } from "../service/api";
import { convertDurationToTimeString } from "../utils/worksWithConvertTime";
import { LatestEpisodeItem } from "../components/homeComponents/LatestEpisodeItem/LatestEpisodeItem";

import styles from './home.module.scss';
import { EpisodeItem } from "../components/homeComponents/EpisodeItem/EpisodeItem";
import { usePlayer } from "../providers/playerProvider";

interface Props {
  allEpisodes: EpisodeData[];
  latestEpisodes: EpisodeData[];
}

export type EpisodeData = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  duration: number;
  durationAsString: string;
}

export default function Home({ allEpisodes, latestEpisodes }: Props) {
  const { play, playList } = usePlayer();

  const episodesList = [...latestEpisodes, ...allEpisodes];

  function handlePlay(currentIndex: number) {
    playList(episodesList, currentIndex);
  }

  return (
    <div className={styles.homePage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Útimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => (
            <LatestEpisodeItem
              key={episode.id}
              episode={episode}
              onPlay={() => handlePlay(index)}
            />
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => (
              <EpisodeItem
                key={episode.id}
                episode={episode}
                onPlay={() => handlePlay(index + latestEpisodes.length)}
              />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes: EpisodeData[] = data.map((episode) => {
    const { published_at, file, ...all } = episode;

    return {
      ...all,
      publishedAt: format(parseISO(published_at), 'd MMM yy', {
        locale: ptBR
      }),
      duration: Number(file.duration),
      durationAsString: convertDurationToTimeString(Number(file.duration)),
      url: file.url
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}