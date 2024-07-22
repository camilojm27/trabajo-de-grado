import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Facil de usar',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        La plataforma esta diseñada para ser fácil de usar, y ahorrar tiempo tanto a desarrolladores
        como administradores de sistemas.
      </>
    ),
  },
  {
    title: 'Adaptable',
    description: (
      <>
        La plataforma es adaptable a cualquier tipo de proyecto, ya que utiliza tecnologías modernas y modulares como laravel y rabbitmq,
        lo cual permite una fácil integración con otros sistemas.
      </>
    ),
  },
  {
    title: 'Potenciado por Codigo abierto',
    description: (
      <>
        Este proyecto funciona gracias al esfuero de muchos desarrolladores y organizaciones que han contribuido a la comunidad de codigo abierto.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
