import Head from "next/head";
import Link from "next/link";
const Layout = ({ children }) => {
  return (
    <div style={{ width: "100%" }}>
      <Head>
        <title>Meme Generator</title>
        <meta name="description" content="Meme generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav
        style={{
          width: "100%",
          backgroundColor: "white",
          height: "100px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: "auto 20px",
          }}
        >
          <h1
            style={{
              lineHeight: 1,
              margin: 0,
              color: "purple",
              fontSize: "40px",
            }}
          >
            Meme Generator
          </h1>
        </div>

        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Link href="/">
            <a
              style={{
                padding: "16px",
                margin: "auto 10px",
                backgroundColor: "purple",
                fontWeight: "bold",
                color: "white",
                borderRadius: "2px",
              }}
            >
              Home
            </a>
          </Link>

          <Link href="/upload">
            <a
              style={{
                padding: "16px",
                margin: "auto 10px",
                backgroundColor: "purple",
                fontWeight: "bold",
                color: "white",
                borderRadius: "2px",
              }}
            >
              Upload Photo/Video
            </a>
          </Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
