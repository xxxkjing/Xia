const CONFIG = {
  // profile setting (required)
  profile: {
    name: "MetaIllusion",
    image: "/avatar.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "不务正业的高中生",
    bio: "Time, Truth, and Hearts",
    email: "xkjing.xiajing@gmail.com",
    linkedin: "",
    github: "xxxkjing",
    instagram: "",
  },
  projects: [
     {
       name: `DownList`,
       href: "https://github.com/xxxkjing/DownList",
     },
     {
       name: `Xia So`,
       href: "https://so.shfu.cn",
     },
     {
       name: `SoftLock`,
       href: "https://github.com/xxxkjing/SoftLock",
     },
   ],
  // blog setting (required)
  blog: {
    title: "MetaIllusion 的博客",
    description: "记录一个高中生日常的博客",
    scheme: "dark", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://xia.shfu.cn",
  since: 2024, // If leave this empty, current year will be used.
  lang: "zh-CN", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: "xxxkjing/giscus-comment",
      "issue-term": "og:title",
      label: "💬评论",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 1, // revalidate time for [slug], index
}

module.exports = { CONFIG }
