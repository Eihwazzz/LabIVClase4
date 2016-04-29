  
var app = angular.module('ABMangularPHP', ['ui.router','angularFileUpload']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //
  // For any unmatched url, redirect to /state1
  
  //
  // Now set up the states
    .state('menu', {
      url: "/menu",
      templateUrl: "templateMenu.html",
      controller:'controlMenu'
    })
    .state('grilla', {
      url: "/grilla",
      templateUrl: "templateGrilla.html",
      controller:'controlGrilla'
    })
    .state('usuario', {
      url: "/usuario",
      templateUrl: "templateUsuario.html",
      controller:'controlAlta'
    })
    .state('modificar', {
      url: "/modificar/{:id}?:nombre:apellido:dni:foto",
      templateUrl: "templateUsuario.html",
      controller:'controlModificar'
    });
    $urlRouterProvider.otherwise("/menu");
   
});


var indexPersona;

app.controller('controlMenu', function($scope, $http) {
  $scope.DatoTest="**Menu**";
});


app.controller('controlAlta', function($scope, $http, FileUploader) {
  $scope.DatoTest="**alta**";
  $scope.uploader = new FileUploader({url: 'PHP/nexo.php'});
  $scope.uploader.queueLimit = 1; 
//inicio las variables
  $scope.persona={};
  $scope.persona.nombre= "natalia" ;
  $scope.persona.dni= "12312312" ;
  $scope.persona.apellido= "natalia" ;
  $scope.persona.foto="pordefecto.png";
  $scope.cargarFoto = function(nombreDeFoto){
    var direccion = "fotos/"+nombreDeFoto;
    $http.get(direccion, {responseType:"blob"})
      .then(function(respuesta) {       
         var mimetype = respuesta.data.type;
         var archivo = new File([respuesta.data], direccion, {type:mimetype});
         var fotoObtenida = new FileUploader.FileItem($scope.uploader,{});
         fotoObtenida._file = archivo;
         fotoObtenida.file = {};
         fotoObtenida.file = new File([respuesta.data], nombreDeFoto, {type:mimetype});
         $scope.uploader.queue.push(fotoObtenida);
    },function errorCallback(response) {        
        console.log( response);           
    });
  };

  $scope.cargarFoto($scope.persona.foto);


  $scope.uploader.onSuccessItem = function(item, response, status, headers) {
    $http.post('PHP/nexo.php', { datos: {accion :"insertar",persona:$scope.persona}})
      .then(function(respuesta) {       
         //aca se ejetuca si retorno sin errores        
        console.info("informe", item, response, status, headers);
        console.log(item);

    },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });
  }

  $scope.Guardar=function(){
    if($scope.uploader.queue[0].file.name != 'pordefecto.png')
    {
      var nombreFoto = $scope.uploader.queue[0].file.name;
      $scope.persona.foto = nombreFoto;
    }
    $scope.uploader.uploadAll();

  };
});


app.controller('controlGrilla', function($scope, $http) {
  	$scope.DatoTest="**grilla**";
 	
 	$http.get('PHP/nexo.php', { params: {accion :"traer"}})
 	.then(function(respuesta) {     	

      	 $scope.ListadoPersonas = respuesta.data.listado;
      	 //console.log(respuesta.data);

    },function errorCallback(response) {
     		 $scope.ListadoPersonas= [];
     		console.log( response);

     			/*

					https://docs.angularjs.org/api/ng/service/$http

     			the response object has these properties:

				data – {string|Object} – The response body transformed with the transform functions.
				status – {number} – HTTP status code of the response.
				headers – {function([headerName])} – Header getter function.
				config – {Object} – The configuration object that was used to generate the request.
				statusText – {string} – HTTP status text of the response.
						A response status code between 200 and 299 is considered a success
						 status and will result in the success callback being called. 
						 Note that if the response is a redirect, XMLHttpRequest will 
						 transparently follow it, meaning that 
						 the error callback will not be called for such responses.
 	 */
 	 });

 	$scope.Borrar=function(persona){
		console.log("borrar"+persona);



$http.post("PHP/nexo.php",{datos:{accion :"borrar",persona:persona}},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
 .then(function(respuesta) {       
         //aca se ejetuca si retorno sin errores        
         //console.log(respuesta.data);
         $http.get('PHP/nexo.php', { params: {accion :"traer"}})
          .then(function(respuesta) {       

                 $scope.ListadoPersonas = respuesta.data.listado;
                 console.log(respuesta.data);

            },function errorCallback(response) {
                 $scope.ListadoPersonas= [];
                console.log( response);
           });

    },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });

 	};

  

  $scope.Modificar = function(id){
    $http.post("PHP/nexo.php",{datos:{accion :"traer",idPersona:id}})
       .then(function(respuesta) {     
            $scope.modificar = !$scope.modificar;
            var key = "data";
            $scope.nuevoNombre = respuesta[key].nombre;
            $scope.nuevoApellido = respuesta[key].apellido;
            $scope.nuevoDni = respuesta[key].dni;
            $scope.nuevoId = respuesta[key].id;
          },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });
  };


});
app.controller('controlModificar', function($scope, $http, $stateParams,FileUploader) {
  

  $scope.uploader = new FileUploader({url: 'PHP/nexo.php'});
  $scope.uploader.queueLimit = 1; 

  $scope.DatoTest="**modificar**";
  
  $scope.persona = {};
  $scope.persona.id = $stateParams.id;
  $scope.persona.nombre = $stateParams.nombre;
  $scope.persona.dni = $stateParams.dni;
  $scope.persona.apellido = $stateParams.apellido;
  $scope.persona.foto = $stateParams.foto;

 $scope.cargarFoto = function(nombreDeFoto){
    var direccion = "fotos/"+nombreDeFoto;
    $http.get(direccion, {responseType:"blob"})
      .then(function(respuesta) {       
         var mimetype = respuesta.data.type;
         var archivo = new File([respuesta.data], direccion, {type:mimetype});
         var fotoObtenida = new FileUploader.FileItem($scope.uploader,{});
         fotoObtenida._file = archivo;
         fotoObtenida.file = {};
         fotoObtenida.file = new File([respuesta.data], nombreDeFoto, {type:mimetype});
         $scope.uploader.queue.push(fotoObtenida);
    },function errorCallback(response) {        
        console.log( response);           
    });
  };

  $scope.cargarFoto($scope.persona.foto);
  

  $scope.uploader.onSuccessItem = function(item, response, status, headers) {
    $http.post('PHP/nexo.php', { datos: {accion :"insertar",persona:$scope.persona}})
      .then(function(respuesta) {       
         //aca se ejetuca si retorno sin errores        
        console.log("pase porcargar foto");

    },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });
  };



    $scope.Guardar=function(){
    console.log("Guardando lo modificado");
    if($scope.uploader.queue[0].file.name != 'pordefecto.png')
    {

      var nombreFoto = $scope.uploader.queue[0].file.name;
      $scope.persona.foto = nombreFoto;
    }
    $scope.uploader.uploadAll();

    console.log($scope.persona);
    $http.post('PHP/nexo.php', { datos: {accion :"modificar",persona:$scope.persona}})
    .then(function(respuesta) {       
         //aca se ejetuca si retorno sin errores        
         console.log(respuesta.data);


    },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });

  

  };

  });