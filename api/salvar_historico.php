<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Lê os dados JSON enviados pelo JavaScript
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if ($data) {
    // Salvar em um arquivo local (pode mudar para banco de dados)
    file_put_contents("historico.json", json_encode($data, JSON_PRETTY_PRINT));
    
    // Responder com sucesso
    echo json_encode(["status" => "sucesso", "mensagem" => "Histórico salvo com sucesso"]);
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Dados inválidos"]);
}
?>
