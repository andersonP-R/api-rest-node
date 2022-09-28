const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mi_blog");

    // parametros dentro del obj - solo en caso de aviso
    // useNewUrlParser: true
    // useUnifieldTopoly: true
    // useCreateIndex: true

    console.log("conected to mi_blog database");
  } catch (error) {
    console.log(error);
    throw new Error("conection error");
  }
};

module.exports = {
  connection,
};
