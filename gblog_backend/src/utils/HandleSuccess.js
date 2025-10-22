const handleSucces = (statusCode = 200, message = "success", data = {}) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

export { handleSucces };
