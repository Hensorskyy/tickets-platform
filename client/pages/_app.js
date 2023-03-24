import 'bootstrap/dist/css/bootstrap.css'

import Header from '../components/Header'
import { getAxiosClient } from '../api/helper'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  let currentUser = {}
  let pageProps = {}
  try {
    const { data } = await getAxiosClient(appContext.ctx).get('/api/users/currentUser')
    currentUser = data?.currentUser

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }
  }
  catch (err) {
    console.log(err)
  }
  finally {
    return { pageProps, currentUser }
  }
}

export default AppComponent