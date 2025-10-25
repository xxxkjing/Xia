import Document, { Html, Head, Main, NextScript } from "next/document"
import { CONFIG } from "site.config"

class MyDocument extends Document {
  render() {
    return (
      <Html lang={CONFIG.lang}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="/apple-touch-icon.png"
          ></link>
          <link
            rel="alternate"
            type="application/rss+xml"
            title="RSS 2.0"
            href="/feed"
          ></link>
          {/* google search console */}
          {CONFIG.googleSearchConsole.enable === true && (
            <>
              <meta
                name="google-site-verification"
                content={CONFIG.googleSearchConsole.config.siteVerification}
              />
            </>
          )}
          {/* naver search advisor */}
          {CONFIG.naverSearchAdvisor.enable === true && (
            <>
              <meta
                name="naver-site-verification"
                content={CONFIG.naverSearchAdvisor.config.siteVerification}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument