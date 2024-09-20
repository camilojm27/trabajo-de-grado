import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Plataforma de Gestion de Contenedores en Red",
  tagline: "(con docker 🐳)",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https:/camilojm27.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/trabajo-de-grado",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "camilojm27", // Usually your GitHub org/user name.
  projectName: "trabajo-de-grado", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "es",
    locales: ["es"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Inicio",
      // logo: {
      //   alt: 'My Site Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentación",
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: "https://github.com/camilojm27/trabajo-de-grado",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentación",
          items: [
            {
              label: "Instalación",
              to: "/docs/installation",
            },
            {
              label: "Arquitectura",
              to: "/docs/architecture",
            },
          ],
        },
        {
          title: "Gracias a:",
          items: [
            {
              label: "Universidad del Valle",
              href: "https://www.univalle.edu.co/",
            },
            {
              label: "Jhon A. Sanabria",
              href: "https://www.linkedin.com/in/johhn-sanabria-a72bb317",
            },
            {
              label: "Camilo José Mezú Mina",
              href: "https://www.linkedin.com/in/camilojm27",
            },
          ],
        },
        {
          title: "Tecnologias",
          items: [
            {
              label: "Laravel (PHP Framework)",
              href: "https://laravel.com/",
            },
            {
              label: "RabbitMQ",
              href: "https://www.rabbitmq.com/",
            },
            {
              label: "Go Programming Language",
              href: "https://golang.org/",
            },
            {
              label: "Docker SDK for Go",
              href: "https://docs.docker.com/engine/api/sdk/",
            },
            {
              label: "React.JS",
              href: "https://reactjs.org/",
            },
          ],
        },
      ],
      copyright: `Hecho con 💛 | Camilo José Mezú Mina | 👷🏾 con 📃🦖Docusaurus.`,
    },
    prism: {
      theme: prismThemes.shadesOfPurple,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
