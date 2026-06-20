<?php
require_once 'config.php';

class Router {
    private $routes = [];

    public function get($chemin, $callback) {
        $this->routes[] = ['GET', $chemin, $callback];
    }

    public function post($chemin, $callback) {
        $this->routes[] = ['POST', $chemin, $callback];
    }

    public function put($chemin, $callback) {
        $this->routes[] = ['PUT', $chemin, $callback];
    }

    public function delete($chemin, $callback) {
        $this->routes[] = ['DELETE', $chemin, $callback];
    }

    public function run() {
        $methode = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = rtrim($uri, '/') ?: '/';

        foreach ($this->routes as [$routeMethode, $routeChemin, $callback]) {
            $pattern = preg_replace('/:([a-zA-Z_]+)/', '([^/]+)', $routeChemin);
            $pattern = '#^' . $pattern . '$#';

            if ($routeMethode === $methode && preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                call_user_func_array($callback, $matches);
                return;
            }
        }

        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Route introuvable']);
    }
}

$router = new Router();
require 'routes.php';
$router->run();
