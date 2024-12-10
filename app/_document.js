import Document, { Html, Head, Main, NextScript } from 'next/document';

class BarkDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Link to Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default BarkDocument;
