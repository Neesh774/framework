import Head from "next/head";

export default function MetaTags({
  title,
  description,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.svg" />
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
        </>
      )}
      <meta property="og:type" content="website" />
      {description && (
        <>
          <meta name="description" content={description || ""} />
          <meta property="og:description" content={description} />
        </>
      )}
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="twitter:image" content={image} />
        </>
      )}
      <meta name="theme-color" content="#9F9DFF" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
