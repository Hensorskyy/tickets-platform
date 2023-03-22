import axios from "axios"
import { useState } from "react"

export const useRequest = ({ method, url, body }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)
      console.log(response.data)
    }
    catch (err) {
      const errors = (
        <div className="alert alert-danger">
          <h4>Opppss....
          </h4>
          <ul className="my-0">
            {err?.response?.data?.errors?.map((err, index) => <li key={index}>{err?.message}</li>)}
          </ul>
        </div>)
      setErrors(errors)
    }
  }

  return { doRequest, errors }
}