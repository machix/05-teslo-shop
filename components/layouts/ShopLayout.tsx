import { FC } from "react";
import Head from "next/head";
import { Navbar } from "../ui";

interface Props {
  children: React.ReactNode;
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const ShopLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={pageDescription} />

        {imageFullUrl && <meta property="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <Navbar />
      </nav>
      {/* TODO: Sidebar */}
      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        {children}
      </main>
      {/* Footer */}
      <footer>{/* TODO: mi custom Footer */}</footer>
    </>
  );
};
