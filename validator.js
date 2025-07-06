<?php
header('Content-Type: application/json');

$lessons = [
    [
        'title' => 'Введение в HTML',
        'tasks' => [
            ['validator' => 'validate_html_task1']
        ]
    ],
    [
        'title' => 'Основы CSS',
        'tasks' => [
            ['validator' => 'validate_css_task1']
        ]
    ]
];

function validate_html_task1($code) {
    if (preg_match('/<h1>\s*Привет,\s*мир!\s*<\/h1>/i', $code)) {
        return ['success' => true, 'message' => 'Правильно!', 'output' => $code];
    }
    return ['success' => false, 'message' => 'Добавьте текст "Привет, мир!" в h1'];
}

function validate_css_task1($code) {
    if (preg_match('/color\s*:\s*red/i', $code)) {
        return ['success' => true, 'message' => 'Отлично!', 'output' => $code];
    }
    return ['success' => false, 'message' => 'Используйте свойство color: red'];
}

$lesson_id = (int)($_POST['lesson'] ?? 0);
$task_id = (int)($_POST['task'] ?? 0);
$code = $_POST['code'] ?? '';

if ($lesson_id > 0 && $task_id >= 0 && isset($lessons[$lesson_id-1]['tasks'][$task_id])) {
    $validator = $lessons[$lesson_id-1]['tasks'][$task_id]['validator'];
    echo json_encode(call_user_func($validator, $code));
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка проверки задания']);
}
?>