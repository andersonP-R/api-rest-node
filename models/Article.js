const { Schema, model } = require("mongoose");

// Schema para la creación del modelo de datos para los articulos.
const ArticleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // .now() es un metodo de mongoose para dar una fecha por defecto.
  },
  image: {
    type: String,
    default: "default.png",
  },
});

module.exports = model("Article", ArticleSchema);
// el metodo model() recive en su primer parametro el nombre que le damos al modelo para guardar los datos en la db (articles)
// y en el segundo parametro el Schema que va a tener todos los datos que guardemos. Algo así como una interface, un contrato.

// Podemos crear modelos para lo que necesitemos. Si queremos guardar un usuario en la db, modelos para los comentarios, likes,
// interacciones, lo que sea
