<?php
// api/get_alunos_turma.php
header('Content-Type: application/json'); // Garante que a resposta é JSON
header('Access-Control-Allow-Origin: *'); // Permite requisições de qualquer origem (para desenvolvimento)

require_once 'db_config.php'; // Inclui as configurações de conexão

$turmaId = isset($_GET['turmaId']) ? $_GET['turmaId'] : null;

$response = [
    'success' => false,
    'message' => 'Nenhum aluno encontrado.',
    'alunos' => []
];

// Por simplicidade, vamos buscar todos os alunos por enquanto.
// Em um cenário real, você faria um JOIN com uma tabela de relacionamento aluno-turma.
// Ex: SELECT a.* FROM alunos a JOIN turma_alunos ta ON a.id = ta.aluno_id WHERE ta.turma_id = ?
$sql = "SELECT id, nome, ra FROM alunos ORDER BY nome ASC"; //
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $alunos = [];
        while ($row = $result->fetch_assoc()) {
            $alunos[] = $row;
        }
        $response['success'] = true;
        $response['message'] = 'Alunos encontrados com sucesso.';
        $response['alunos'] = $alunos;
    } else {
        $response['message'] = 'Nenhum aluno cadastrado.';
    }
    $result->free();
} else {
    $response['message'] = 'Erro ao executar a consulta: ' . $conn->error;
}

$conn->close();

echo json_encode($response);
?>