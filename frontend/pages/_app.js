import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'next-auth/client'
import { Layout } from '../components/Layout'
import { InfoProvider } from '../context/GlobalContext'

function MyApp({ Component, pageProps }) {
  return (
    <InfoProvider>
      <Provider session={pageProps.session}>
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </Provider>
    </InfoProvider>
  )
}

export default MyApp
