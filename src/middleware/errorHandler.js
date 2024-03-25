export default (err, req, res, next) => {
  console.error(err.message);
  return res.status(500).json({
    message:
      "It's not you. It's us. Please wait for awhile while we're fixing things.",
  });
};
