<?php
// Функция для отображения урока
function displayLesson($lessonIndex) {
    global $lessons;
    
    if (!isset($lessons[$lessonIndex])) {
        echo "<p>Урок не найден.</p>";
        return;
    }
    
    $lesson = $lessons[$lessonIndex];
    
    echo "<h2>{$lesson['title']}</h2>";
    echo "<div class='lesson-text'>{$lesson['content']}</div>";
    
    // Отображаем задания
    if (!empty($lesson['tasks'])) {
        foreach ($lesson['tasks'] as $taskIndex => $task) {
            $taskId = "lesson_{$lessonIndex}_task_{$taskIndex}";
            
            echo "<div class='task'>";
            echo "<h4>Задание " . ($taskIndex + 1) . "</h4>";
            echo "<p>{$task['description']}</p>";
            
            echo "<form class='task-form' data-task-id='{$taskId}'>";
            echo "<textarea class='code-editor' placeholder='Введите ваш код здесь...'>{$task['template']}</textarea>";
            echo "<button type='submit' class='button'>Проверить</button>";
            echo "<div class='result'></div>";
            echo "</form>";
            
            echo "</div>";
        }
    }
}

// Функция для проверки заданий
function validateTask($taskId, $userCode) {
    global $lessons;
    
    // Парсим ID задания
    preg_match('/lesson_(\d+)_task_(\d+)/', $taskId, $matches);
    if (count($matches) < 3) {
        return ['success' => false, 'message' => 'Неверный ID задания'];
    }
    
    $lessonIndex = $matches[1];
    $taskIndex = $matches[2];
    
    if (!isset($lessons[$lessonIndex]['tasks'][$taskIndex])) {
        return ['success' => false, 'message' => 'Задание не найдено'];
    }
    
    $task = $lessons[$lessonIndex]['tasks'][$taskIndex];
    $validationFunction = $task['validator'];
    
    // Вызываем функцию проверки
    return $validationFunction($userCode);
}

// Вспомогательные функции валидации
function checkHtmlStructure($userCode, $requiredTags) {
    $dom = new DOMDocument();
    @$dom->loadHTML($userCode);
    
    $missingTags = [];
    foreach ($requiredTags as $tag) {
        if ($dom->getElementsByTagName($tag)->length === 0) {
            $missingTags[] = $tag;
        }
    }
    
    if (!empty($missingTags)) {
        return [
            'success' => false,
            'message' => 'Отсутствуют обязательные теги: ' . implode(', ', $missingTags)
        ];
    }
    
    return ['success' => true, 'message' => 'HTML структура верна!'];
}

function checkCssProperty($userCode, $property, $value) {
    $pattern = "/{$property}\s*:\s*{$value}/i";
    if (!preg_match($pattern, $userCode)) {
        return [
            'success' => false,
            'message' => "Свойство {$property}: {$value} не найдено"
        ];
    }
    
    return ['success' => true, 'message' => 'CSS свойство найдено!'];
}

function checkJsFunction($userCode, $functionName) {
    if (!preg_match("/function\s+{$functionName}\s*\(/", $userCode)) {
        return [
            'success' => false,
            'message' => "Функция {$functionName} не найдена"
        ];
    }
    
    return ['success' => true, 'message' => 'Функция найдена!'];
}

function checkJsOutput($userCode, $expectedOutput) {
    ob_start();
    try {
        eval($userCode);
        $output = ob_get_clean();
        
        if (trim($output) === trim($expectedOutput)) {
            return ['success' => true, 'message' => 'Вывод верный!'];
        } else {
            return [
                'success' => false,
                'message' => "Ожидался вывод: '{$expectedOutput}', получено: '{$output}'"
            ];
        }
    } catch (Exception $e) {
        ob_end_clean();
        return ['success' => false, 'message' => 'Ошибка выполнения: ' . $e->getMessage()];
    }
}
?>