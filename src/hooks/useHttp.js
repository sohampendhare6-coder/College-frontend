import http from "../http-common";
import { useCallback, useState } from "react";

const useHttp = () => {
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setError(null);
    try {
      let responseData;

      if (requestConfig.method === "get") {
        responseData = await http.get(requestConfig.url);
      } else if (requestConfig.method === "post") {
        responseData = await http.post(requestConfig.url, requestConfig.data);
      } else if (requestConfig.method === "put") {
        responseData = await http.put(requestConfig.url, requestConfig.data);
      } else if (requestConfig.method === "delete") {
        responseData = await http.delete(
          `${requestConfig.url}?id=${requestConfig.id}`
        );
      }

      if (responseData) {
        applyData(responseData.data);
      }
    } catch (err) {
      // Surface the real server error message when available
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Something went wrong";
      setError(message);
      console.error("useHttp error:", message, err?.response?.status);
    }
  }, []);

  return { error, sendRequest };
};

export default useHttp;
