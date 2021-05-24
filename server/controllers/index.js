const createResponse = (error, data) => {
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

const respondItem = async (response, res, next) => {
  const { error, data } = await response;
  if (error) {
    next(error);
  } else {
    res.json(data);
  }
};

module.exports = {
  createResponse,
  getListResponse,
  respondItem,
};
