import React, { useState } from "react";

import Router from "next/router";
import { useRequest } from "../hooks/useRequst";

const LoginForm = ({ title, submitUrl }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    method: "post",
    url: submitUrl,
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{title}</h1>
      <div className="form-group">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target?.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target?.value)}
        />
      </div>
      {errors}
      <button className="btn btn-primary">{title}</button>
    </form>
  );
};

export default LoginForm;
