import axios from "axios";
import { useState } from "react";

export const useRequest = ({ method, url, body, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      const controller = new AbortController();
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...props,
        signal: controller.signal,
      });
      controller.abort();
      if (onSuccess) {
        onSuccess(response?.data);
      }
      return response.data;
    } catch (err) {
      const errors = (
        <div className="alert alert-danger">
          <h4>Opppss....</h4>
          <ul className="my-0">
            {err?.response?.data?.errors?.map((err, index) => (
              <li key={index}>{err?.message}</li>
            ))}
          </ul>
        </div>
      );
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return { doRequest, isLoading, errors };
};
