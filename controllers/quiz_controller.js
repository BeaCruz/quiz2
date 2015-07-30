var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
exports.index = function(req, res) {
//  var filtro = '';
  var busqueda = req.query.search;
  console.log('busqueda -->' + busqueda);
  if(busqueda != 'undefined' && busqueda != null){
	// reemplazar espacios por %
	busqueda=busqueda.replace(/\s+/g,'%');
	console.log('despues reemplazar espacios blancos busqueda -->' + busqueda);
	busqueda+= '%';
	busqueda = '%' + busqueda;
  }
  else {
	  busqueda = '%';
  }
  console.log(busqueda);
  //console.log(filtro);
  
  models.Quiz.findAll({where: ["pregunta like ?", busqueda]}).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes , errors:[]});
    }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render(
    'quizes/answer', 
    { quiz: req.quiz, 
      respuesta: resultado, 
      errors: []
    }
  );
};

// GET /author
exports.author = function(req, res) {
   res.render('author', {nombre: 'Bea', errors:[]});
};


// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz 
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};