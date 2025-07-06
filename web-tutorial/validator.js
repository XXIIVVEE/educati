<?php
require_once 'functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
    exit;
}

$taskId = $_POST['task_id'] ?? '';
$userCode = $_POST['code'] ?? '';

if (empty($taskId) || empty($userCode)) {
    echo json_encode(['success' => false, 'message' => 'Неверные данные']);
    exit;
}

$result = validateTask($taskId, $userCode);
echo json_encode($result);
?>