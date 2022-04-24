import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document{
    render(){
        return(
            <Html lang="pt-BR">
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link rel="shortcut icon" href="/logo.png" type="image/jpg"/>
                    <meta name="description" content="Ufes fórum"></meta>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}