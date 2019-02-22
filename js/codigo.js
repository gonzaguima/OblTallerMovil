//INGRESAR AL SISTEMA O IR A CREAR CUENTA
function login() {
  var email = $("#email").val();
  var pass = $("#password").val();
  var mensaje = "";
  var query = {
    email: email,
    password: pass
  };
  var q = JSON.stringify(query);

  if (email != "" && pass != "") {
    //login en servidor e ingresar
    $.ajax({
      url: "http://api.marcelocaiafa.com/login",
      type: "POST",
      dataType: "JSON",
      data: q,
      success: correctoLogin,
      error: errorLogin
    });
  } else {
    mensaje = "Debe completar todos los datos";
    $("#mensaje").text(mensaje);
  }
}

//LOGIN CORRECTO
function correctoLogin(response) {
  sessionStorage.setItem('key', response.description.token);
  sessionStorage.setItem('logueado', response.description.usuario.id);
  var key = sessionStorage.getItem('key')
  console.log(key);
  //borrar!!!!!
  fn.load("principal.html");
}

//LOGIN INCORRECTO
//AGREGAR CASOS DE ERROR
function errorLogin(response) {
  mensaje = "Email o Contraseña no válidos";
  $("#mensaje").text(mensaje);
}

//CREAR USUARIO
function nuevoUsuario() {
  var email = $("#email").val();
  var tel = $("#telefono").val();
  var pass = $("#password").val();
  var mensaje = "";
  var query = {
    email: email,
    password: pass,
    telefono: tel
  };
  var q = JSON.stringify(query);

  if (email != "" && tel != "" && pass != "") {
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
  } else {
    mensaje = "Debe completar todos los datos";
  }
  $("#mensaje").text(mensaje);
}

// USUARIO CORRECTO
function correctoUsuario(response) {
  sessionStorage.setItem('key', response.description.token);
  sessionStorage.setItem('logueado', response.description.usuario.id);
  console.log(key);
  //borrar!!!!!
  fn.load("principal.html");
}

//USUARIO INCORRECTO
//AGREGAR CASOS DE ERROR
function errorUsuario(response) {
  mensaje = "Email ya se encuentra registrado";
  $("#mensaje").text(mensaje);
}

//REGISTRAR NUEVO VEHICULO
function agregarVehiculo() {
  var matricula = $("#matricula").val();
  var desc = $("#descripcion").val();
  var mensaje = "";
  var query = {
    matricula: matricula,
    descripcion: desc,
    usuario: logueado.id
  };
  var q = JSON.stringify(query);
  if (matricula != "" && descripcion != "") {
    var key = sessionStorage.getItem('key')
    $.ajax({
      url: "http://api.marcelocaiafa.com/vehiculo",
      type: "POST",
      dataType: "JSON",
      data: q,
      headers: { Authorization: key },
      success: correctoVehiculo,
      error: errorVehiculo
    });
  } else {
    $("#mensaje").text("Debe completar todos los datos");
  }
}

//CORRECTO VEHICULO
function correctoVehiculo() {
  $("#mensaje").text("El vehículo fue agregado correctamente");
}

//ERROR VEHICULO
function errorVehiculo() {
  $("#mensaje").text("El vehículo no se pudo agregar");
}

//AGREGAR MANTENIMIENTO
function agregarMantenimiento() {}

//LOGOUT
function logout() {
    var key = sessionStorage.getItem('key')
  $.ajax({
    url: "http://api.marcelocaiafa.com/logout",
    type: "POST",
    headers: { Authorization: key },
    success: correctoLogout,
    error: errorLogout
  });
}

//CORRECTO LOGOUT
function correctoLogout() {
    storage.removeItem("key");
  fn.load("home.html");
}

//ERROR LOGOUT
function errorLogout() {
  $("#mensaje").text("Ocurrió un error al cerrar sesión");
}

//MENU
window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById("menu");
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById("content");
  var menu = document.getElementById("menu");
  content.load(page).then(menu.close.bind(menu));
};

//LISTAR SERVICIOS
function listarServicios(){
    var key = sessionStorage.getItem('key')
  $.ajax({
    url: "http://api.marcelocaiafa.com/servicio",
    type: "GET",
    headers: { Authorization: key },
    success: correctoServicios,
    error: errorServicios
  });
  console.log("entra");
}

//CARGA SERVICIOS
function correctoServicios(response){
    console.log("carga de servicios ok")
    response.description.forEach(function (r, i) {
        $("#servicios").append('<option value=\'' + r.id + '\'>' + r.nombre + '</option>');
    });
}
//ERROR CARGA SERVICIOS
function errorServicios(response){
    console.log("carga de servicios fallo");
}

//CARGAR MAPA
var map;
var directionDisplay;
var directionService;
function initMap() {
    navigator.geolocation.getCurrentPosition(MostrarUbicacion, MostrarError, { enableHighAccuracy: true });
}


//ERROR MAPA
function MostrarError() {
    ons.notification.alert("La ubicación no es correcta");
}

//CORRECTO MAPA
function MostrarUbicacion(pos) {    
    listarServicios();
    var crd = pos.coords;    
    var latitud = parseFloat(crd.latitude);   
    var longitud = parseFloat(crd.longitude);   
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitud, lng: longitud },
        zoom: 13
    });
    var marker = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },
        map: map,
        title: 'Mi ubicacion',
    });
  agregarEvento(marker);
}

function agregarEvento(marker) {
    var infowindow = new google.maps.InfoWindow({
      content: marker.getTitle() + marker.getPosition()
    });

    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });
}

//CARGAR TALLERES FILTRADOS
function cargarTalleres(){
    var sel = $("#servicios").val();
    var key = sessionStorage.getItem('key')
    var q = "http://api.marcelocaiafa.com/taller/?servicio=" + sel;
    $.ajax({
        url: q,
        type: "GET",
        headers: { Authorization: key },
        success: mostrarTalleres,
        error: errorTalleres
      });
}

//CORRECTO MOSTRAR TALLERES
function mostrarTalleres(response){
    $("#talleres").html("");
        response.description.forEach(function (r, i) {
            $("#talleres").append(
                "<h3>" + r.descripcion + "</h3>" + 
                "<p> Dirección: " + r.direccion + "</p>" +
                "<p> Teléfono: " + r.telefono + "</p>" +
                "<hr>"
                );
        });
        
    }    

function errorTalleres(){
    console.log("error carga talleres");
}