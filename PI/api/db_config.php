<?php
// api/db_config.php

// Detalhes de conexão com o banco de dados
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Usuário padrão do XAMPP
define('DB_PASS', '');     // Senha padrão do XAMPP (geralmente vazia)
define('DB_NAME', 'sanquim'); // Nome do seu banco de dados

// Conexão com o banco de dados
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verifica a conexão
if ($conn->connect_error) {
    die("Falha na conexão com o banco de dados: " . $conn->connect_error);
}

// Opcional: Definir o charset para UTF-8
$conn->set_charset("utf8");

?>