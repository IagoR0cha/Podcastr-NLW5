import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { EpisodeData } from "..";
import { usePlayer } from "../../providers/playerProvider";
import { api } from "../../service/api";
import { convertDurationToTimeString } from "../../utils/worksWithConvertTime";

import styles from './episode.module.scss';

interface Props {
  episode: EpisodeData;
}

export default function Episode({ episode }: Props) {
  const { play } = usePlayer();

  return (
    <div className={styles.container}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/" passHref>
          <button type="button">
            <Image
              width={30}
              height={30}
              src={'/arrow-left.svg'}
              alt="Voltar"
            />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <Image
            width={40}
            height={40}
            src={'/play.svg'}
            alt="Tocar episódio"
          />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(({ id }) => ({
    params: {
      slug: id
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const { data } = await api.get(`/episodes/${slug}`);

  const { published_at, file, ...all } = data;

  const episode = {
    ...all,
    publishedAt: format(parseISO(published_at), 'd MMM yy', {
      locale: ptBR
    }),
    duration: Number(file.duration),
    durationAsString: convertDurationToTimeString(Number(file.duration)),
    url: file.url
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 // 24 horas
  }
}