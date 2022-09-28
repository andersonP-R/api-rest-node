const express = require("express");
const ArticleController = require("../controllers/article");
const multer = require("multer"); // libreria para subir img

const router = express.Router();

// modelo para almacenar los archivos en el storage

const storageImages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/articles");
  }, // indicamos en donde se van a guardar los archivos con cb(). El primer parametri siempre es null
  filename: function (req, file, cb) {
    cb(null, "article" + Date.now() + file.originalname);
  }, // configuramos donde se van a guardar los archivos que subamos
});

const uploadsImgs = multer({ storage: storageImages }); // le indicamos que "storage" la constante que creamos, que ese va a ser el almacenamiento
// que esas son las rutas en las que van a ir los archivos y que ese va a ser el formato de cada archivo

// la propiedad storage del obj multer es para indicar el modelo que se va a seguir para las subidas de archivos. Guardamos en una
// const para pasarla como middleware a las rutas en las que se hacen subidas de archivos.

// Test routes
router.get("/test", ArticleController.test);
router.get("/course", ArticleController.course);

// Real routes
router.post("/create", ArticleController.create); // ruta para crear un documento
router.get("/articles/:latest?", ArticleController.getArticles); // ruta para obtener todos los documentos y con un filtro para obtener x ultimos que necesitemos
router.get("/article/:id", ArticleController.getOne); // ruta para obtener un documento
router.delete("/article/:id", ArticleController.deleteOne); // ruta para borrar un documento
router.put("/article/:id", ArticleController.updateOne); // ruta para actualizar un documento
router.post(
  "/upload-img/:id",
  [uploadsImgs.single("file0")],
  ArticleController.upLoadImg
);
// usamos el middleware uploads y usamos su metodo .single() ya que vamos a subir un solo archivo. "file" es el nombre del campo del archivo que vamos a subir
// ruta para subir img

router.get("/image/:file", ArticleController.getImage); // ruta para obtener una img
router.get("/search/:search", ArticleController.search); // ruta para hacer busquedas en la db

module.exports = router;

// el "/:" indica que el parametro es obligatorio pero con el "?" al final, le decimos que el parametro es opcional
