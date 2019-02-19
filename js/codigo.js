
//INGRESAR AL SISTEMA O IR A CREAR CUENTA

function login(){
    var email = $("#email").val();
    var pass = $("#password").val();
    var mensaje = "";
    if(email != "" && pass != ""){
        //validar existencia e ingresar
        fn.load('opciones.html');
    }else{
        mensaje = "Debe completar todos los datos";
        $("#mensaje").text(mensaje);
    }
}

//CREAR USUARIO 

function nuevoUsuario(){
    var email = $("#email").val();
    var tel = $("#telefono").val();
    var pass = $("#password").val();
    var mensaje = "";
    if(email != "" && tel != "" && pass != ""){
        //verificar no existe, crear nuevo y loguearlo
        //desactivar acceso a otras secciones por el menu 
        fn.load('settings.html');
    }else{
        mensaje = "Debe completar todos los datos";
        $("#mensaje").text(mensaje);
    }
}

//REGISTRAR NUEVO VEHICULO

function agregarVehiculo(){

}

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};




