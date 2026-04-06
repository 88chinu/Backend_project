const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Server Error" });
};

export default errorHandler;