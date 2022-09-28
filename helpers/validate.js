const validator = require("validator");

const validateArticle = (paramsQuery) => {
  let validate_title =
    !validator.isEmpty(paramsQuery.title) && // comprobamos si no esta vacio. Si da false (si hay titulo)
    validator.isLength(paramsQuery.title, { min: 5, max: undefined }); // y si esto da true (esta en el rango). Validate title se convierte en true.
  let validate_content = !validator.isEmpty(paramsQuery.content);

  if (!validate_title || !validate_content) {
    throw new Error("Incorrect data validation!");
  }
};

module.exports = {
  validateArticle,
};

// Validar los datos con Validator. Try-catch por que es codigo susceptible a errores
