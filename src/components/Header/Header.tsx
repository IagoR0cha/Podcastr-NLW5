import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.scss';

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  });

  return (
    <header className={styles.headerContainer}>
      <Link href={'/'} passHref>
        <button type="button">
          <Image height={40} width={150} src="/logo.svg" alt="logo" />
        </button>
      </Link>
      <p>O melhor para você ouvir, sempre</p>
      <span>{ currentDate }</span>
    </header>
  )
}

