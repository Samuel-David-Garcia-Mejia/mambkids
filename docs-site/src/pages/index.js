import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Leer documentación →
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://mambkids.online"
            style={{ marginLeft: '1rem' }}>
            Ver la app
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout title="Inicio" description="Documentación oficial de MAMB Kids">
      <HomepageHeader />
      <main>
        <section style={{ padding: '3rem 0', textAlign: 'center' }}>
          <div className="container">
            <div className="row">
              <div className="col col--4">
                <h3>🎨 Arte + IA</h3>
                <p>Los niños capturan sus dibujos y la IA los transforma en obras de arte con estilos de grandes maestros.</p>
              </div>
              <div className="col col--4">
                <h3>🏆 Sistema de logros</h3>
                <p>Los usuarios desbloquean logros conforme crean obras, exploran estilos y guardan favoritos.</p>
              </div>
              <div className="col col--4">
                <h3>🖼️ Galería virtual</h3>
                <p>Todas las obras se publican en una galería compartida del museo, accesible para toda la comunidad.</p>
              </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link
                className="button button--primary button--lg"
                href="https://github.com/Samuel-David-Garcia-Mejia/mambkids">
                Ver repositorio en GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
