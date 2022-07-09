import { getPosts, getPostLength } from "./theme/serverUtils";

async function config() {
  return {
    lang: "en-US",
    title: "Ikaros",
    description: "Home of Ikaros",
    head: [
      [
        "link",
        {
          rel: "icon",
          // type: 'image/png',
          type: "image/jpeg",
          href: "/avator.jpg",
        },
      ],
      [
        "meta",
        {
          name: "author",
          content: "Ikaros",
        },
      ],
      [
        "meta",
        {
          property: "og:title",
          content: "Home",
        },
      ],
      [
        "meta",
        {
          property: "og:description",
          content: "Home of Ikaros",
        },
      ],
    ],
    themeConfig: {
      // repo: "clark-cui/homeSite",
      logo: "/tea.svg",
      docsDir: "/",
      // docsBranch: "master",
      lastUpdated: false,
      posts: await getPosts(),
      pageSize: 5, //几个为一页
      postLength: await getPostLength(), //博客有几篇

      //       algolia: {
      //         apiKey: "90a0bae6ff7307fb76896cbe2f975b0c",
      //         indexName: "clark-cui-docs",
      //       },

      nav: [
        {
          text: "🏡Home",
          link: "/",
        },
        {
          text: "🔖Tags",
          link: "/tags",
        },
        {
          text: "📃Archives",
          link: "/archives",
        },
      ],

      sidebar: {
        "./posts/": false,
        "/": false,
      },
      // sidebar: false,
    },
  };
}
export default config();
