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

  if (email != "" || pass != "") {
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
  sessionStorage.setItem("key", response.description.token);
  sessionStorage.setItem("logueado", response.description.usuario.id);
  var key = sessionStorage.getItem("key");
  fn.load("principal.html");
}

//LOGIN INCORRECTO
function errorLogin(response) {
  $("#mensaje").text(response.responseJSON.descripcion);
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

  if (email != "" || tel != "" || pass != "") {
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
  sessionStorage.setItem("key", response.description.token);
  sessionStorage.setItem("logueado", response.description.usuario.id);

  fn.load("principal.html");
}

//USUARIO INCORRECTO
function errorUsuario(response) {
  $("#mensaje").text(response.responseJSON.descripcion);
}

//REGISTRAR NUEVO VEHICULO
function agregarVehiculo() {
  var matricula = $("#matricula").val();
  var desc = $("#descripcion").val();
  var mensaje = "";
  var logueado = sessionStorage.getItem("logueado");
  var query = {
    matricula: matricula,
    descripcion: desc,
    usuario: logueado
  };
  var q = JSON.stringify(query);
  if (matricula != "" || descripcion != "") {
    var key = sessionStorage.getItem("key");
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
function correctoVehiculo(response) {
  $("#mensaje").text("El vehículo fue agregado correctamente");
}

//ERROR VEHICULO
function errorVehiculo(response) {
  $("#mensaje").text(response.responseJSON.descripcion);
}

//LOGOUT
function logout() {
  var key = sessionStorage.getItem("key");
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
function errorLogout(response) {
  $("#mensaje").text(response.responseJSON.descripcion);
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
  var key = sessionStorage.getItem("key");
  $.ajax({
    url: "http://api.marcelocaiafa.com/servicio",
    type: "GET",
    headers: {
      Authorization: key
    },
    success: correctoServicios,
    error: errorServicios
  });

}

var todosServicios = [];
//CARGA SERVICIOS
function correctoServicios(response) {
  todosServicios = [];

  response.description.forEach(function (r, i) {
    var servId = r.id;
    var servNom = r.nombre;
    $("#servicios").append(
      "<option value='" + servId + "'>" + servNom + "</option>"
    );
    todosServicios.push({
      servId,
      servNom
    });
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

  map = new google.maps.Map(document.getElementById("map"), {
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
    title: "Mi ubicación"
  });
  agregarEvento(marker);
}
//AGREGAR EVENTO
function agregarEvento(marker) {
  var infowindow = new google.maps.InfoWindow({
    content: "<h4>" +
      marker.getTitle() +
      "</h4>" +
      "<br />" +
      '<ons-button modifier="material" onclick="mostrarRuta(' +
      marker.getPosition().lat() +
      "," +
      marker.getPosition().lng() +
      ')">IR</ons-button>'
  });

  marker.addListener("click", function () {
    infowindow.open(marker.get("map"), marker);
  });
}
var sel;
//CARGAR TALLERES FILTRADOS
function cargarTalleres() {
  sel = $("#servicios").val();
  var key = sessionStorage.getItem("key");
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

//CORRECTO MOSTRAR TALLERES
function mostrarTalleres(response) {
  $("#talleres").html("");
  borrarMarcadores();
  response.description.forEach(function (r, i) {
    $("#talleres").append(
      "<span style='font-size:1.5em; color:blue;'>" +
      r.descripcion +
      "</span>" +
      "<br />" +
      '<img src="http://images.marcelocaiafa.com/' +
      r.imagen +
      '" style="height:100px; width:auto;" alt="imagen">' +
      "<p> Dirección: " +
      r.direccion +
      "</p>" +
      "<p> Teléfono: " +
      r.telefono +
      "</p>" +
      '<ons-button modifier="outline light" onclick="return agregarFav(\'' +
      r.id +
      "','" +
      r.descripcion +
      "')\">" +
      'Fav <span><i class="far fa-star" ></i></span></ons-button>' +
      '<ons-button modifier="material" onclick="showTemplateDialog(\'' +
      r.id +
      "','" +
      r.descripcion +
      "')\">Agregar Mantenimiento</ons-button>" +
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
      title: r.descripcion
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
    travelMode: "DRIVING"
  };
  directionService.route(request, function (result, status) {
    if (status == "OK") {
      directionDisplay.setDirections(result);
    }
  });
  directionDisplay.setMap(map);
}

//AGREGAR TALLER FAVORITO
function agregarFav(id, nombre) {
  var idTaller = id;
  var nombreTaller = nombre;
  db.transaction(function (tx) {
    tx.executeSql("INSERT INTO favoritos (id , nombre) VALUES (?, ?)", [
      idTaller,
      nombreTaller
    ]);
  });
}

//CREA BASE DE DATOS PARA FAVORITOS
$(document).ready(function () {
  db = window.openDatabase("bdd", "1.0", "favoritos", 1024 * 1024 * 5);
  db.transaction(function (tx) {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS favoritos(id int PRIMARY KEY NOT NULL UNIQUE, nombre string)"
    );
  });
});

//RECUPERA FAVORITOS
function verFav() {
  db.transaction(function (tx) {
    tx.executeSql("SELECT DISTINCT id, nombre FROM favoritos", [], function (
      tx,
      results
    ) {
      if (results.rows.length > 0) {
        for (var i = 0; i < results.rows.length; i++) {
          $("#favs").append(
            '<option value="' +
            results.rows.item(i).id +
            '">' +
            results.rows.item(i).nombre +
            "</option>"
          );
        }
      } else {
        console.log("favoritos vacios");
      }
    });
  });
}

//VEHICULOS DE USUARIO
function buscarVehiculos() {
  var key = sessionStorage.getItem("key");
  var logueado = sessionStorage.getItem("logueado");
  var q = "http://api.marcelocaiafa.com/vehiculo/?usuario=" + logueado;
  $.ajax({
    url: q,
    type: "GET",
    headers: {
      Authorization: key
    },
    success: mostrarVehiculos,
    error: errorMostrarVeh
  });
}
var vehUsu = [];
//MOSTRAR VEHICULOS
function mostrarVehiculos(response) {
  vehUsu = [];
  response.description.forEach(function (r, i) {
    vehUsu.push(r);
    var vId = r.id;
    var vMat = r.matricula;
    var vDesc = r.descripcion;
    $("#vehiculos").append(
      "<option value='" +
      vId +
      "'>" +
      r.matricula +
      " - " +
      r.descripcion +
      "</option>"
    );
  });
  verFav();
}

function mantReady() {
  buscarVehiculos();
  listarServicios();
  verFav();
}

//ERROR MOSTRAR VEHICULOS
function errorMostrarVeh(response) {
  console.log("error");
}

//NUEVO MANTENIMIENTO MAPA
function nuevoMant() {
  var key = sessionStorage.getItem("key");
  var agrVeh = $("#vehiculos").val();
  var agrSer = sel;
  var agrDes = $("#desc").val();
  var agrTall = $("#idtall").text();
  var agrKm = $("#km").val();
  var agrCosto = $("#costo").val();
  var agrFecha = new Date(Date.now()).toLocaleString();
  if (
    agrVeh != "Seleccione un vehículo" ||
    agrDes != "" ||
    agrKm != "" ||
    agrCosto != ""
  ) {
    $.ajax({
      url: "http://api.marcelocaiafa.com/mantenimiento",
      type: "POST",
      dataType: "JSON",
      data: JSON.stringify({
        vehiculo: agrVeh,
        descripcion: agrDes,
        fecha: agrFecha,
        servicio: agrSer,
        kilometraje: agrKm,
        costo: agrCosto,
        taller: agrTall
      }),
      headers: {
        Authorization: key
      },
      success: correctoMant,
      error: errorMant
    });
  } else {
    $("#mensaje").text("Ingrese todos los datos");
  }
}
//CORRECTO MANT
function correctoMant(response) {
  $("#mensaje").text("El servicio se agregó correctamente");
  diezMant();

}

//ERROR MANT
function errorMant(response) {
  $("#mensaje").text(response.responseJSON.descripcion);
}

//MOSTRAR DIALOG
var showTemplateDialog = function (id, desc) {
  var dialog = document.getElementById("dialog");

  if (dialog) {
    dialog.show();
  } else {
    ons
      .createElement("dialog.html", {
        append: true
      })
      .then(function (dialog) {
        dialog.show();
        buscarVehiculos();
        $("#idtall").html(id);
        $("#tallSelecc").html(desc);
        todosServicios.forEach(s => {
          if (sel == s.servId) {
            $("#servSelecc").html(s.servNom);
          }
        });
      });
  }
};
//OCULTAR DIALOG
var hideDialog = function (id) {
  document.getElementById(id).hide();
};

//NUEVO MANTENIMIENTO FULL
function agregarMantenimiento() {
  var key = sessionStorage.getItem("key");
  var agrVeh = $("#vehiculos").val();
  var agrSer = $("#servicios").val();
  var agrDes = $("#desc").val();
  var agrTall = $("#favs").val();
  var agrKm = $("#km").val();
  var agrCosto = $("#costo").val();
  var agrFecha = new Date(Date.now()).toLocaleString();
  if (
    agrVeh != "Seleccione un vehículo" ||
    agrSer != "Seleccione un servicio" ||
    agrTall != "Seleccione un taller" ||
    agrDes != "" ||
    agrKm != "" ||
    agrCosto != ""
  ) {
    $.ajax({
      url: "http://api.marcelocaiafa.com/mantenimiento",
      type: "POST",
      dataType: "JSON",
      data: JSON.stringify({
        vehiculo: agrVeh,
        descripcion: agrDes,
        fecha: agrFecha,
        servicio: agrSer,
        kilometraje: agrKm,
        costo: agrCosto,
        taller: agrTall
      }),
      headers: {
        Authorization: key
      },
      success: correctoMant,
      error: errorMant
    });
  } else {
    $("#mensaje").text("Ingrese todos los datos");
  }
}

function pedirMant() {
  var veh = $("#vehiculos").val();
  mostrarServicios(veh);
}

//MOSTRAR MANTENIMIENTOS
function mostrarServicios(a) {
  var key = sessionStorage.getItem("key");
  $.ajax({
    url: "http://api.marcelocaiafa.com/mantenimiento",
    type: "GET",
    dataType: "JSON",
    data: {
      vehiculo: a
    },
    headers: {
      Authorization: key
    },
    success: correctoListado,
    error: errorListado
  });
}
var mantUsuario = 0;
//CORRECTO LISTADO
function correctoListado(response) {
  var gastado = 0;
  $("#mostrarServ").empty();
  if (response.description.length == 0) {
    $("#msgListado").html(
      "No hay registrado mantenimientos para este Vehiculo."
    );
  } else {
    response.description.forEach(function (e, i) {
      mantUsuario++;
      $("#mostrarServ").append(
        "<ons-list-item expandable onclick=\"ampliarInfoMant('" +
        e.id +
        "', '#expandir" +
        e.id +
        "')\">" +
        e.descripcion +
        " Fecha: " +
        e.created +
        '<div class="expandable-content" id=\'expandir' +
        e.id +
        "'></div></ons-list-item>"
      );
      var unServ = Number(e.costo);
      gastado += unServ;
    });
  }
  $("#total").html(
    "En este vehículo se lleva gastado en mantenimiento $" + gastado
  );
  if (mantUsuario >= 10) {
    navigator.vibrate([500, 200, 500]);
    console.log("vibra!");
  }
}
//ERROR LISTADO
function errorListado() {
  console.log(response.responseJSON.descripcion);
}

//AMPLIAR INFO
function ampliarInfoMant(idMantenimiento, parametro) {
  var key = sessionStorage.getItem("key");
  $.ajax({
    url: "http://api.marcelocaiafa.com/mantenimiento",
    type: "GET",
    dataType: "JSON",
    data: {
      id: idMantenimiento
    },
    headers: {
      Authorization: key
    },
    success: function (response) {
      var r = response.description.mantenimiento;
      var s = response.description.servicio;
      $(parametro).html(
        "Fecha: " +
        r.created +
        "<br> Taller: " +
        r.taller +
        " <br> Servicio: " +
        s.nombre +
        "<br> Descripcion: " +
        s.descripcion +
        " <br> Precio: $" +
        r.costo
      );
    },
    error: errorAmpliacion
  });
}

//ERROR AMPLIACION
function errorAmpliacion(response) {
  console.log(response.responseJSON.descripcion);
}

//10 MANTENIMIENTOS
function diezMant() {
  mantUsuario = 0;
  console.log("contando...");
  vehUsu.forEach(function (e, i) {
    mostrarServicios(e.id);
  });
}