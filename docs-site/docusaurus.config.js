// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MAMB Kids — Documentación',
  tagline: 'Arte, Tecnología e Inteligencia Artificial para niños de Barranquilla',
  favicon: 'img/favicon.svg',

  url: 'https://Samuel-David-Garcia-Mejia.github.io',
  baseUrl: '/mambkids/',

  organizationName: 'Samuel-David-Garcia-Mejia',
  projectName: 'mambkids',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Samuel-David-Garcia-Mejia/mambkids/edit/main/docs-site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/mamb-social.png',
      navbar: {
        title: 'MAMB Kids',
        logo: {
          alt: 'MAMB Kids Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentación',
          },
          {
            href: 'https://calm-desert-027745d10.7.azurestaticapps.net/',
            label: 'Ver App',
            position: 'left',
          },
          {
            href: 'https://github.com/Samuel-David-Garcia-Mejia/mambkids',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentación',
            items: [
              { label: 'Introducción', to: '/docs/intro' },
              { label: 'Arquitectura', to: '/docs/arquitectura' },
              { label: 'Instalación', to: '/docs/instalacion' },
            ],
          },
          {
            title: 'Proyecto',
            items: [
              {
                label: 'App en producción (Azure)',
                href: 'https://calm-desert-027745d10.7.azurestaticapps.net/',
              },
              {
                label: 'Repositorio GitHub',
                href: 'https://github.com/Samuel-David-Garcia-Mejia/mambkids',
              },
              {
                label: 'Contribuidores',
                href: 'https://github.com/Samuel-David-Garcia-Mejia/mambkids/graphs/contributors',
              },
            ],
          },
          {
            title: 'Institución',
            items: [
              {
                label: 'MAMB — Museo de Arte Moderno de Barranquilla',
                href: 'https://calm-desert-027745d10.7.azurestaticapps.net/',
              },
              {
                label: 'Universidad Simón Bolívar',
                href: 'https://www.unisimonbolivar.edu.co',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MAMB Kids · Universidad Simón Bolívar · Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['javascript', 'sql', 'bash'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
