export const errorCreate = (errors) => {
   let extractedErrors = {};
   errors.forEach((err) => {
      extractedErrors[err.path] = err.msg;
   });
   return extractedErrors;
};
