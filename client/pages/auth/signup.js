import { useRequest } from "../../hooks/useRequst"
import { useState } from "react"

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { doRequest, errors } = useRequest({ method: "post", url: '/api/users/signup', body: { email, password } })
  const onSubmit = async (event) => {
    event.preventDefault()
    doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email address</label>
        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target?.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target?.value)} />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}