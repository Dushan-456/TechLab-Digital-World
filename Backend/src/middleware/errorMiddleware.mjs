// Centralized error handling middleware


// General error handler
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR CAUGHT IN MIDDLEWARE:", err);
  
  // Multer errors may be thrown in upload flows
  if (err && err.name === "MulterError") {
    console.error("🚨 MULTER ERROR DETAILS:", {
      message: err.message,
      code: err.code,
      field: err.field
    });
    
    let userFriendlyMessage = err.message;
    if (err.code === "LIMIT_FILE_SIZE") {
      userFriendlyMessage = `File is too large (${err.field}). Please ensure images are under the allowed size limit.`;
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      userFriendlyMessage = `Too many files uploaded for ${err.field}.`;
    }

    return res.status(400).json({
      success: false,
      message: userFriendlyMessage,
      error: err.message,
      code: err.code,
      field: err.field
    });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  // Avoid leaking stack traces in production
  const includeStack = process.env.NODE_ENV !== "production";

  res.status(status).json({
    success: false,
    message,
    ...(includeStack ? { stack: err.stack } : {}),
  });
};
