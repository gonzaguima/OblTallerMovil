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


//CARGAR MAPA
function initMap() {

    navigator.geolocation.getCurrentPosition(MostrarUbicacion, MostrarError);
}
//ERROR MAPA
function MostrarError() {
    ons.notification.alert("La ubicación no es correcta");
}

//CORRECTO MAPA
function MostrarUbicacion(pos) {    
  
    var crd = pos.coords;    
    var latitud = parseFloat(crd.latitude);   
    var longitud = parseFloat(crd.longitude);   
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitud, lng: longitud },
        zoom: 19
    });
    var marker = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },
        map: map,
        title: 'Mi ubicacion',
    });

    agregarEvento(marker);
    
    var latitud= -34.9038526;
    var longitud= -56.1905803;
    marker = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },
        map: map,
        title: 'Universidad ORT Uruguay'
    });
    agregarEvento(marker);

    directionDisplay = new google.maps.DirectionsRenderer();
    directionService = new google.maps.DirectionsService();

    request={
        origin:{lat:-34.9038526, lng:-56.1905803},
        destination:{lat:parseFloat(crd.latitude),lng:parseFloat(crd.longitude)},
        travelMode:'DRIVING'
    };
    directionService.route(request, function(result,status){
        if(status=='OK'){
            directionDisplay.setDirections(result);
        }
    })
    directionDisplay.setMap(map);
}