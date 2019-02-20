var key;
var logueado;
//INGRESAR AL SISTEMA O IR A CREAR CUENTA
function login(){
    var email = $("#email").val();
    var pass = $("#password").val();
    var mensaje = "";
    var query = {
        "email":email,
        "password":pass,
    };
    var q = JSON.stringify(query);

    if(email != "" && pass != ""){
        //login en servidor e ingresar
        $.ajax({
            url: "http://api.marcelocaiafa.com/login",
            type: "POST",
            dataType: "JSON",
            data: q,
            success: correctoLogin,
            error: errorLogin
        });
    }else{
        mensaje = "Debe completar todos los datos";
        $("#mensaje").text(mensaje);
    }
}

//LOGIN CORRECTO
function correctoLogin(response){
    key = response.description.token;
    logueado = response.description.usuario;
    console.log(key);
    console.log(logueado);
    //borrar!!!!!
    fn.load('principal.html');
}

//LOGIN INCORRECTO
//AGREGAR CASOS DE ERROR
function errorLogin(response){
    mensaje = "Email o Contraseña no válidos";
    $("#mensaje").text(mensaje);
}

//CREAR USUARIO
function nuevoUsuario(){
    var email = $("#email").val();
    var tel = $("#telefono").val();
    var pass = $("#password").val();
    var mensaje = "";
    var query = {
        "email":email,
        "password":pass,
        "telefono":tel
    };
    var q = JSON.stringify(query);

    if(email != "" && tel != "" && pass != ""){
        //verificar no existe, crear nuevo y loguearlo
        //desactivar acceso a otras secciones por el menu
        $.ajax({
            url: "http://api.marcelocaiafa.com/usuario",
            type: "POST",
            dataType: "JSON",
            data: q,
            success: correctoUsuario,
            error: errorUsuario
        });
    }else{
        mensaje = "Debe completar todos los datos";
    }
    $("#mensaje").text(mensaje);
}

// USUARIO CORRECTO
function correctoUsuario(response){
    key = response.description.token;
    console.log(key);
    //borrar!!!!!
    fn.load('principal.html');
}

//USUARIO INCORRECTO
//AGREGAR CASOS DE ERROR
function errorUsuario(response){
    mensaje = "Email ya se encuentra registrado";
    $("#mensaje").text(mensaje);
}

//REGISTRAR NUEVO VEHICULO
function agregarVehiculo(){
    var matricula = $("#matricula").val();
    var desc = $("#descripcion").val();
    var mensaje = "";
    var query = {
        "matricula":matricula,
        "descripcion":desc,
        "usuario":logueado.id
       }
    var q = JSON.stringify(query);
    if(matricula != "" && descripcion != ""){
        //verificar no existe, crear nuevo y loguearlo
        //desactivar acceso a otras secciones por el menu
        $.ajax({
            url: "http://api.marcelocaiafa.com/vehiculo",
            type: "POST",
            dataType: "JSON",
            data: q,
            success: correctoVehiculo,
            error: errorVehiculo
        });
    }else{
        mensaje = "Debe completar todos los datos";
    }
    $("#mensaje").text(mensaje);
}

//CORRECTO VEHICULO
function correctoVehiculo(){

}

//ERROR VEHICULO
function errorVehiculo(){

}

//AGREGAR MANTENIMIENTO
function agregarMantenimiento(){

}

//LOGOUT
function logout(){
    var query = {
        "Authorization": key,
    };
    var q = JSON.stringify(query);
    $.ajax({
        url: "http://api.marcelocaiafa.com/logout",
        type: "POST",
        dataType: "JSON",
        data: q,
        success: correctoLogout,
        error: errorLogout
    });
}

//CORRECTO LOGOUT
function correctoLogout(){
    key = "";
    fn.load('home.html');
}


//ERROR LOGOUT
function errorLogout(){
    $("#mensaje").text("Ocurrió un error al cerrar sesión");
}


//MENU
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




