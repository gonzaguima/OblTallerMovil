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
  var logueado = sessionStorage.getItem('logueado');
  var query = {
    matricula: matricula,
    descripcion: desc,
    usuario: logueado
  };
  var q = JSON.stringify(query);
  if (matricula != "" && descripcion != "") {
    var key = sessionStorage.getItem('key');
    $.ajax({
      url: "http://api.marcelocaiafa.com/vehiculo",
      type: "POST",
      dataType: "JSON",
      data: q,
      headers: {
        Authorization: key
      },
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
    headers: {
      Authorization: key
    },
    success: correctoLogout,
    error: errorLogout
  });
}

//CORRECTO LOGOUT
function correctoLogout() {
  sessionStorage.removeItem("key");
  fn.load("home.html");
}

//ERROR LOGOUT
function errorLogout() {
  $("#mensaje").text("Ocurrió un error al cerrar sesión");
}

//MENU
window.fn = {};
window.fn.open = function () {
  var menu = document.getElementById("menu");
  menu.open();
};
window.fn.load = function (page) {
  var content = document.getElementById("content");
  var menu = document.getElementById("menu");
  content.load(page).then(menu.close.bind(menu));
};

//LISTAR SERVICIOS
function listarServicios() {
  var key = sessionStorage.getItem('key')
  $.ajax({
    url: "http://api.marcelocaiafa.com/servicio",
    type: "GET",
    headers: {
      Authorization: key
    },
    success: correctoServicios,
    error: errorServicios
  });
  console.log("entra");
}

//CARGA SERVICIOS
function correctoServicios(response) {
  console.log("carga de servicios ok")
  response.description.forEach(function (r, i) {
    $("#servicios").append('<option value=\'' + r.id + '\'>' + r.nombre + '</option>');
  });
}
//ERROR CARGA SERVICIOS
function errorServicios(response) {
  console.log("carga de servicios fallo");
}

//CARGAR MAPA
var map;
var directionDisplay;
var directionService;
var latlng = [];
var markers = [];

function initMap() {
  navigator.geolocation.getCurrentPosition(MostrarUbicacion, MostrarError, {
    enableHighAccuracy: true
  });
}


//ERROR MAPA
function MostrarError() {
  ons.notification.alert("La ubicación no es correcta");
}
var crd;
//CORRECTO MAPA
function MostrarUbicacion(pos) {
  listarServicios();
  crd = pos.coords;
  var latitud = parseFloat(crd.latitude);
  var longitud = parseFloat(crd.longitude);

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: latitud,
      lng: longitud
    },
    zoom: 13
  });
  var marker = new google.maps.Marker({
    position: {
      lat: latitud,
      lng: longitud
    },
    map: map,
    title: 'Mi ubicación',
  });
  agregarEvento(marker);
}
//AGREGAR EVENTO
function agregarEvento(marker) {
  var infowindow = new google.maps.InfoWindow({
    content: "<h4>" + marker.getTitle() + "</h4>" + "<br />" +
      '<ons-button modifier="material" onclick="mostrarRuta(' + marker.getPosition().lat() + "," + marker.getPosition().lng() + ')">IR</ons-button>'
  });

  marker.addListener('click', function () {
    infowindow.open(marker.get('map'), marker);
  });
}

//CARGAR TALLERES FILTRADOS
function cargarTalleres() {
  var sel = $("#servicios").val();
  var key = sessionStorage.getItem('key')
  var q = "http://api.marcelocaiafa.com/taller/?servicio=" + sel;
  $.ajax({
    url: q,
    type: "GET",
    headers: {
      Authorization: key
    },
    success: mostrarTalleres,
    error: errorTalleres
  });
}

//onclick="return agregarFav(\'' + r.id + '\',\'' + r.descripcion + '\')"
//onclick="agregarFav('+ r.id , +  r.descripcion +')"
//CORRECTO MOSTRAR TALLERES
function mostrarTalleres(response) {
  $("#talleres").html("");
  borrarMarcadores();
  response.description.forEach(function (r, i) {
    $("#talleres").append(
      "<span style='font-size:1.5em; color:blue;'>" + r.descripcion + "</span>" + "<br />" +
      '<img src="http://images.marcelocaiafa.com/' + r.imagen + '" style="height:100px; width:auto;" alt="imagen">' +
      "<p> Dirección: " + r.direccion + "</p>" +
      "<p> Teléfono: " + r.telefono + "</p>" +
      '<ons-button modifier="outline light" onclick="return agregarFav(\'' + r.id + '\',\'' + r.descripcion + '\')">' + 'Fav <span><i class="far fa-star" ></i></span></ons-button>' +
      "<hr>"
    );
    var lat = parseFloat(r.lat);
    var lng = parseFloat(r.lng);
    var marker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      map: map,
      title: r.descripcion,
    });
    agregarEvento(marker);
    markers[i] = marker;
    latlng.push(new google.maps.LatLng(lat, lng));
  });

  var latlngbounds = new google.maps.LatLngBounds();
  for (var i = 0; i < latlng.length; i++) {
    latlngbounds.extend(latlng[i]);
  }
  map.fitBounds(latlngbounds);
}


//ERROR CARGA TALLERES
function errorTalleres() {
  console.log("error carga talleres");
}
//BORRAR MARCADORES
function borrarMarcadores() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
  latlngbounds = new google.maps.LatLngBounds();
}

//MOSTRAR RUTA
function mostrarRuta(mlat, mlng) {
  console.log("entra " + mlat + " " + mlng);
  directionDisplay = new google.maps.DirectionsRenderer();
  directionService = new google.maps.DirectionsService();

  request = {
    origin: {
      lat: parseFloat(crd.latitude),
      lng: parseFloat(crd.longitude)
    },
    destination: {
      lat: parseFloat(mlat),
      lng: parseFloat(mlng)
    },
    travelMode: 'DRIVING'
  };
  directionService.route(request, function (result, status) {
    if (status == 'OK') {
      directionDisplay.setDirections(result);
    }
  })
  directionDisplay.setMap(map);
}

//AGREGAR TALLER FAVORITO
function agregarFav(id, nombre) {
  console.log("fav");
  var idTaller = id;
  var nombreTaller = nombre;
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO favoritos (id , nombre) VALUES (?, ?)', [idTaller, nombreTaller]);
  });
}

//CREA BASE DE DATOS PARA FAVORITOS
$(document).ready(function () {
  db = window.openDatabase("bdd", "1.0", "favoritos", 1024 * 1024 * 5);
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS favoritos(id int PRIMARY KEY NOT NULL UNIQUE, nombre string)');
  });
})

//RECUPERA FAVORITOS
function verFav() {
  console.log("verfav");

  db.transaction(function (tx) {
    tx.executeSql('SELECT DISTINCT id, nombre FROM favoritos', [], function (tx, results) {
      if (results.rows.length > 0) {
        for (var i = 0; i < results.rows.length; i++) {
          console.log(results.rows.item(i));
          $("#favs").append(
            '<option value="' + results.rows.item(i).id + '">' + results.rows.item(i).nombre + '</option>')
        }
      } else {
        console.log("favoritos vacios")
      }
    });
    });
  };


//VEHICULOS DE USUARIO
function buscarVehiculos() {
  var key = sessionStorage.getItem('key')
  var logueado = sessionStorage.getItem('logueado');
  var q = "http://api.marcelocaiafa.com/vehiculo/?usuario=" + logueado;
  $.ajax({
    url: q,
    type: "GET",
    headers: {
      Authorization: key
    },
    success: mostrarVehiculos,
    error: errorMostrarVeh,
  });
}

//MOSTRAR VEHICULOS
function mostrarVehiculos(response) {
  console.log(response);

  response.description.forEach(function (r, i) {
    var vId = r.id;
    var vMat = r.matricula;
    var vDesc = r.descripcion;
    $("#vehiculos").append(
      '<option value=\'' + vId + '\'>' + r.matricula + " - " + r.descripcion + '</option>'
    );
    console.log(vId + "" + vMat + "" + vDesc);
  });
  verFav();
}

//ERROR MOSTRAR VEHICULOS

function errorMostrarVeh(response) {
  console.log("error");
}