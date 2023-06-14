import LoginForm from "../../components/LoginForm";

export default () => {
  return <LoginForm title={"Sign Up"} submitUrl={"/api/users/signup"} />;
};
