<?php
$data = file_get_contents('php://input');
$file = 'historico.json';

if (!empty($data)) {
    file_put_contents($file, $data);
    echo json_encode(["status" => "success", "message" => "Histórico salvo com sucesso!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Nenhum dado recebido"]);
}
?>
