const fs = require("fs"); // para crear archivos, leerlos, enviarlos, etc. (Node method)
const path = require("path"); // para gestion de rutas de archivos (Node method)
const Article = require("../models/Article");
const { validateArticle } = require("../helpers/validate");

const test = (req, res) => {
  return res.status(200).json({
    message: "It is working!",
  });
};

const course = (req, res) => {
  return res.status(200).json({
    curso: "master react",
    autor: "anderson",
  });
};

// metodo para crear un archivo

const create = (req, res) => {
  // Recoger los parametros por post a guardar
  let params = req.body;

  // Validar los datos con Validator. Try-catch por que es codigo susceptible a errores
  try {
    validateArticle(params); // helper creado para validación
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data",
    });
  }

  // Crear el obj a guardar
  const article = new Article(params); // le pasamos los datos que recogemos por params y este automaticamente los asigna.
  // la key title se la asigna al value title que nos llegue y asi con todas las key del obj. (automatico)

  // Asignar valores a obj basado en el modelo (manual o automatico)
  // Forma manual: articulo.title = params.title
  // Esta forma es mas tediosa ya que no sabemos la cantidad de keys que nos lleguen en nuestro obj. (manual)

  // Guarda el articulo en la db
  article.save((error, savedArticle) => {
    if (error || !savedArticle) {
      return res.status(400).json({
        status: "error",
        message: "Article not saved",
      });
    }

    // Devolver el resultado
    return res.status(200).json({
      status: "succes",
      article,
      message: "Article saved!",
    });
  });
};
//-------------------------------------------------------------------------------------------------------------------------------

// Listar (conseguir) todos los documentos que tengamos en la db
const getArticles = (req, res) => {
  let query = Article.find({});

  if (req.params.latest) {
    query.limit(3);
  }
  // podemos encadenar los metodos que queramos a la query. .limit() establece un limite de documentos que nos devuelve en la peticion
  // le pasamos el numero de documentos que queremos obtener.
  // Podemos revisar la documentación del ORM (mongoose) para usar mas metodos para modificar nuestras queries en base a nesecidades

  query.sort({ date: -1 }).exec((error, articles) => {
    if (error || !articles) {
      return res.status(404).json({
        status: "error",
        message: "Articles not found!",
      });
    }

    return res.status(200).send({
      status: "success",
      articles, // finalmente devolvemos los datos que trajimos de la db
    });
  });
};
// .find() es para hacer una busqueda en la db, el obj del primer parametro es para especificar filtros como: busquedas por nombre
// titulos o alguna propiedad x de nuestros documentos. Revizar documentación. Y con .exec() ejecutamos la consulta.

// con .sort({}) podemos ordenar especificando en las llaves si queremos ordenar por fechas, por id, por titulo, etc.

// .sort({ date: -1 })
// en este caso estamos ordenando por la propiedad "date" y especificamos que el orden es de mas reciente a mas antiguo (-1)

//-------------------------------------------------------------------------------------------------------------------------------

// metodo para conseguir un solo documento
const getOne = (req, res) => {
  // recoger id por url
  let id = req.params.id;

  // buscar el articulo
  Article.findById(id, (error, article) => {
    // si no existe devolver error
    if (error || !article) {
      return res.status(404).json({
        status: "error",
        message: "Article not found!",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      article,
    });
  });
};

//-------------------------------------------------------------------------------------------------------------------------------

// Metodo para borrar un documento

const deleteOne = (req, res) => {
  let articleId = req.params.id;

  Article.findOneAndDelete({ _id: articleId }, (error, articleDeleted) => {
    if (error || !articleDeleted) {
      return res.status(500).json({
        status: "error",
        article: "Error action",
      });
    }

    return res.status(200).json({
      status: "success",
      article: articleDeleted,
    });
  });
};
// .findOneAndDelete(), en sus parametro inicial, le pasamos el nombre de la propiedad por la cual queremos buscar el documento
// y borrarlo. Lo normal es buscar por el _id.
// Despues, le pasamos como value el id (article_id) del documento que quermos borrar.
// Como segundo parametro del metodo para borrar un documento de la db, le pasamos el callback para controlar el posible error y
// si todo va bien, devolver el documento borrado (articleDeleted)

//-------------------------------------------------------------------------------------------------------------------------------

const updateOne = (req, res) => {
  // Recoger id articulo a editar
  let articleId = req.params.id;

  // Recoger datos del body
  let paramsQuery = req.body;

  // Validar datos
  try {
    validateArticle(paramsQuery); // helper creado para validación
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing data",
    });
  }

  // Buscar y actualizar
  Article.findOneAndUpdate(
    { _id: articleId },
    paramsQuery,
    { new: true }, // con este filtro ( {new: boolean} ) podemos decirle si queremos que nos de el documento actualizado o no. En este caso si queremos que lo devuelva (true)
    (error, articleUpdated) => {
      if (error || !articleUpdated) {
        return res.status(500).json({
          status: "error",
          message: "Updating error",
        });
      }

      // Devolver respuesta
      return res.status(200).json({
        status: "success",
        article: articleUpdated,
      });
    }
  );
  // .findOneAndUpdate() funciona parecido al .findOneAndDelete() Le pasamos en el primer parametro el id (articledId) del documento
  // el cual queremos borrar, luego le pasamos los datos a actualizar (paramsQuery) previamente recogidos en el "req.body" y por
  // ultimo el callback para controlar el posible error y devolver finalmente el documento actualizado
};

//-------------------------------------------------------------------------------------------------------------------------------

// Metodo para subir una img

const upLoadImg = (req, res) => {
  // configurar multer

  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      message: "Error query",
    });
    // comprobamos que se envie un archivo.
  }

  // Nombre del archivo
  let imgFile = req.file.originalname;

  //  Comprobar la extension
  let fileSplit = imgFile.split(`\.`);
  let extension = fileSplit[1];

  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      // el primer parametro de .unlink() es para indicar el archivo a borrar (en este caso el que estemos subiendo)
      // fs es un modulo nativo de Node para la gestion de archivos en el server. En este caso
      // le estamos pasando la ruta del archivo que quermos borrar, el cual viene por url (el que estemos subiendo y no sea un formato aceptable)
      return res.status(400).json({
        status: "error",
        message: "Image error",
      });
    });
  } else {
    // Si todo va bien, actualizar el articulo - Recoger id articulo a editar
    let articleId = req.params.id;

    // Buscar y actualizar
    Article.findOneAndUpdate(
      { _id: articleId },
      { image: req.file.filename },
      { new: true }, // con este filtro ( {new: boolean} ) podemos decirle si queremos que nos de el documento actualizado o no. En este caso si queremos que lo devuelva (true)
      (error, articleUpdated) => {
        if (error || !articleUpdated) {
          return res.status(500).json({
            status: "error",
            message: "Updating error",
          });
        }

        // Devolver respuesta
        return res.status(200).json({
          status: "success",
          article: articleUpdated,
          file: req.file,
        });
      }
    );
  }
};

//-------------------------------------------------------------------------------------------------------------------------------

// Metodo para obtener una img

const getImage = (req, res) => {
  let file = req.params.file;
  let disk_path = "./images/articles/" + file;

  fs.stat(disk_path, (error, isExists) => {
    // en el primer parametro de .stat() le pasamos la ruta del archivo
    // con stat(), metodo del modulo "fs", podemos verificar si un archivo existe o no
    if (isExists) {
      return res.sendFile(path.resolve(disk_path)); // path, modulo de node para, en este caso, enviar un archivo con su metodo resolve.
      // si el file existe lo enviamos
    } else {
      return res.status(404).json({
        status: "error",
        message: "Image not found!",
        // de lo contrario mandamos un error
      });
    }
  });
};

//-------------------------------------------------------------------------------------------------------------------------------

// Metodo para buscar un archivo en la db

const search = (req, res) => {
  // Sacar el string de busqueda
  let search = req.params.search;

  // Find OR
  Article.find({
    $or: [
      // $or es como hacer un or en una condicion (SELECT * FROM mi_blog WHERE title=(expresion regular) OR content=(expresion regular))
      { title: { $regex: search, $options: "i" } }, // es como decir; si el titulo (title) incluye ($options: "i") la busqueda (search)
      { content: { $regex: search, $options: "i" } },
    ],
  })
    .sort({ date: -1 }) // ordenamos por fecha de mas reciente a mas antiguo
    .exec((error, articlesFound) => {
      // Ejecutar consulta
      if (error || !articlesFound || articlesFound.length <= 0) {
        return res.status(404).json({
          status: "error",
          message: "Articles not found!",
        });
      }
      // Devolver resultado
      return res.status(200).json({
        status: "success",
        articles: articlesFound,
      });
    });
};

module.exports = {
  test,
  course,
  create,
  getArticles,
  getOne,
  deleteOne,
  updateOne,
  upLoadImg,
  getImage,
  search,
};
