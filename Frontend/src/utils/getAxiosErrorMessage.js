const getAxiosErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message; // server-sent message
  }
  return error.message; // fallback (network or generic Axios message)
};

export default getAxiosErrorMessage;