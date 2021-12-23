import { Header } from '../components/Header/Header';
import { Player } from '../components/Player/Player';
import { PlayerProvider } from '../providers/playerProvider';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {

  return (
    <PlayerProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  )
}

export default MyApp;
