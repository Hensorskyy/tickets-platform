import 'bootstrap/dist/css/bootstrap.css'

import Header from '../components/Header'
import { getAxiosClient } from '../api/helper'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} /> 
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  let currentUser = {}
  let pageProps = {}
  try {
    const axiosClient = getAxiosClient(appContext.ctx)
    const { data } = await axiosClient.get('/api/users/currentUser')
    currentUser = data?.currentUser

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx, axiosClient, currentUser)
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