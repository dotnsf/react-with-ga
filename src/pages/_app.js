import * as gtag from '../lib/gtag';

function MyApp( {Component, pageProps} ){
  return (
    <>
    <script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}/>
    <script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${grag.GA_MEASURE_MENT_ID}');
        `
    }}/>
    <Component {...pageProps} />
    </>
  );
}