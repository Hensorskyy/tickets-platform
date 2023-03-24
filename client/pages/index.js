import { getAxiosClient } from "../api/helper"

const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>
}

LandingPage.getInitialProps = async (context) => {
  let currentUser = {}
  try {
    const { data } = await getAxiosClient(context).get('/api/users/currentUser')
    currentUser = data?.currentUser
  }
  catch (err) {
    console.log(err)
  }
  finally {
    return { currentUser }
  }
}

export default LandingPage