<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header('Access-Control-Allow-Methods: POST, GET, PATCH, DELETE');
header("Allow: GET, POST, PATCH, DELETE");

date_default_timezone_set('America/Argentina/Buenos_Aires');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
   return 0;    
}  

spl_autoload_register(
    function ($nombre_clase) {
        include __DIR__.'/'.str_replace('\\', '/', $nombre_clase) . '.php';
    }
);

define('JWT_KEY', 'DayR7RxvEM4T4efkoEZBSVDjVqrmtdaQZHepj-D4L43GB7mzywkDtr7K-LpjvfKdRRGEqIcvYAPBjCVXñ.');
define('JWT_ALG', 'HS256');
define('JWT_EXP', 300); // segundos


use \Firebase\JWT\JWT;

$metodo = strtolower($_SERVER['REQUEST_METHOD']);
$comandos = explode('/', strtolower($_GET['comando']));
$funcionNombre = $metodo.ucfirst($comandos[0]);

$parametros = array_slice($comandos, 1);
if (count($parametros) >0 && $metodo == 'get') {
    $funcionNombre = $funcionNombre.'ConParametros';
}

if (function_exists($funcionNombre)) {
    call_user_func_array($funcionNombre, $parametros);
} else {
    header(' ', true, 400);
}


function output($val, $headerStatus = 200)
{
    header(' ', true, $headerStatus);
    header('Content-Type: application/json');
    print json_encode($val);
    die;
}

function outputError($codigo = 500)
{
    switch ($codigo) {
        case 400:
            header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad request", true, 400);
            die;
        case 401:
            header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized", true, 401);
            die;
        case 404:
            header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
            die;
        default:
            header($_SERVER["SERVER_PROTOCOL"] . " 500 Internal Server Error", true, 500);
            die;
            break;
    }
}

function inicializarBBDD()
{
    return $bd = new SQLite3(__DIR__ . '/../../adicional/mercadobyte.db');
}

/*function postRestablecer()
{
    $bd = inicializarBBDD();
    $sql = file_get_contents(__DIR__ . '/../../adicional/dump.sql');
    $result = $bd->exec($sql);
    outputJson([]);
}*/

function autenticar($usuario, $clave)
{
    $bd = inicializarBBDD();
    $result = $bd->query("SELECT u.id_usuario as id, u.nombre as nombre, u.id_rol as id_rol, r.nombre as nombre_rol  from usuario u inner join rol r on u.id_rol = r.id_rol where email='$usuario' and password='$clave'");
    $ret = [];

    $fila = $result->fetchArray(SQLITE3_ASSOC);

    if (!empty($fila))
    {
        return $fila;
    }
    return false;
}


function requiereLogin()
{
    try {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            throw new Exception("Token requerido", 1);
        }
        list($jwt) = sscanf($headers['Authorization'], 'Bearer %s');
        $decoded = JWT::decode($jwt, JWT_KEY, [JWT_ALG]);
    } catch(Exception $e) {
        outputError(401);
    }
    return $decoded;
}

/*function getPrivado()
{
    $payload = requiereLogin();
    output(['data' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.']);
}

function getPerfil()
{
    $payload = requiereLogin();
    output(['id' => $payload->uid, 'nombre' => $payload->nombre]);
}
*/

function getMenuConParametros($id)
{
    $bd = inicializarBBDD();
    settype($id, 'integer');
    $result = $bd->query("select titulo as titulo, accion as accion from menu where id_rol = $id");
    $ret = [];
    while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
        $ret[] = $fila; 
    }
    output($ret);
}

function getMisdatosConParametros($id)
{
    $bd = inicializarBBDD();
    settype($id, 'integer');
    $result = $bd->query("select id_usuario as id, nombre || ' ' || apellido as nombre, dni as dni, email as email, domicilio as domicilio, id_localidad as id_localidad, password as password from usuario where id_usuario = $id");
    $fila = $result->fetchArray(SQLITE3_ASSOC);
    output($fila);
}

function getLocalidades()
{
    $bd = inicializarBBDD();
    settype($id, 'integer');
    $result = $bd->query("select 0 as id_localidad, ' Seleccione una opcion..' as nombre_localidad union 
                        select id_localidad as id_localidad, nombre as nombre_localidad from localidad");
    $ret = [];
    while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
        $ret[] = $fila; 
    }
    output($ret);
}

function patchUsuario($id)
{
    settype($id, 'integer');
    $bd = inicializarBBDD();
    $datos = json_decode(file_get_contents('php://input'), true);
    
    $domicilio = $bd->escapeString($datos['domicilio']);
    $localidad = $datos['id_localidad']+0;
    $password = $bd->escapeString($datos['password']);

    $result = @$bd->exec("UPDATE usuario SET domicilio='$domicilio', id_localidad=$localidad, password='$password' WHERE id_usuario=$id");
    output(['id' => $id]);
}

function getComprasConParametros($id)
{
    $bd = inicializarBBDD();
    settype($id, 'integer');
    $result = $bd->query("select id_venta as id_venta, nro_venta as nro_venta, cantidad as cant, v.costo as total, pr.nombre as producto, p.costo as costo, e.descripcion as estado
from venta v inner join publicacion p on v.id_publicacion = p.id_publicacion inner join producto pr on p.id_producto = pr.id_producto inner join estado e on e.id_estado = v.id_estado  where id_cliente = $id");
    $ret = [];
    while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
        $ret[] = $fila; 
    }
    output($ret);
}

function getVentasConParametros($id)
{
    $bd = inicializarBBDD();
    settype($id, 'integer');
    $result = $bd->query("select id_venta as id_venta, nro_venta as nro_venta, cantidad as cant, v.costo as total, pr.nombre as producto, p.costo as costo, e.descripcion as estado
from venta v inner join publicacion p on v.id_publicacion = p.id_publicacion inner join producto pr on p.id_producto = pr.id_producto inner join estado e on e.id_estado = v.id_estado  where id_vendedor = $id");
    $ret = [];
    while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
        $ret[] = $fila; 
    }
    output($ret);
}

function getPublicacionesConParametros($id)
{
    $bd = inicializarBBDD();
    settype($id, 'integer');
    $result = $bd->query("select id_publicacion as id, pr.nombre as titulo, stock as stock, costo as total, nombre_categoria as categoria from publicacion p inner join producto pr on p.id_producto = pr.id_producto inner join categoria c on pr.id_categoria = c.id_categoria where id_vendedor = $id");
    $ret = [];
    while ($fila = $result->fetchArray(SQLITE3_ASSOC)) {
        $ret[] = $fila; 
    }
    output($ret);
}
function postLogin()
{
    $loginData = json_decode(file_get_contents("php://input"), true);
    $logged = autenticar($loginData['email'], $loginData['clave']);

    if ($logged===false) {
        outputError(401);
    }
    //output($logged);
    $payload = [
        'id'       => $logged['id'],
        'nombre'    => $logged['nombre'],
        'id_rol'    => $logged['id_rol'],
        'rol'       => $logged['nombre_rol'],
        'exp'       => time() + JWT_EXP,
    ];
    $jwt = JWT::encode($payload, JWT_KEY, JWT_ALG);
    output(['jwt'=>$jwt]);
}

function postRefresh()
{
    $payload = requiereLogin();
    $payload->exp = time() + JWT_EXP;
    $jwt = JWT::encode($payload, JWT_KEY);
    output(['jwt'=>$jwt]);
}
