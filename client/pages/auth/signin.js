import LoginForm from "../../components/LoginForm"

export default () => {

  return (
    <LoginForm title={'Sign In'} submitUrl={'/api/users/signin'} />
  )
}