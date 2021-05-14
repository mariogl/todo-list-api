const createResponse = (data, error) => {
  const response = {
    error: null,
    data: null,
  };
  if (!data) {
    response.error = error;
  } else {
    response.data = data;
  }
  return response;
};

const getListResponse = (data, total) => ({
  total,
  subtotal: data.length,
  data,
});

module.exports = {
  createResponse,
  getListResponse,
};
