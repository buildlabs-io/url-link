import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

import { appConfig } from "@/lib/config";

export default function LayoutHead() {
  return (
    <>
      <link rel="preconnect" href={appConfig.API_URL} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={appConfig.API_URL} />
      {appConfig.GOOGLE_ANALYTICS && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${appConfig.GOOGLE_ANALYTICS}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', ${JSON.stringify(appConfig.GOOGLE_ANALYTICS)}, {
                                      page_path: window.location.pathname,
                                    });
                                     `,
            }}
          />
        </>
      )}
      <Analytics />
    </>
  );
}
