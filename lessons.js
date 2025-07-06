<?php
$lessons = [
    [
        'title' => 'Введение в HTML',
        'content' => <<<HTML
            <h3>Что такое HTML?</h3>
            <p>HTML (HyperText Markup Language) - это язык разметки, используемый для создания структуры веб-страниц.</p>
            
            <h3>Основные теги</h3>
            <p>Вот некоторые основные HTML-теги:</p>
            <pre><code class="html">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Заголовок страницы&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Заголовок&lt;/h1&gt;
    &lt;p&gt;Абзац текста.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
            
            <button class="button run-code" data-type="html">Запустить код</button>
            <div class="output-frame"></div>
        HTML,
        'tasks' => [
            [
                'description' => 'Создайте базовую HTML-структуру с тегами html, head, body, title и h1.',
                'template' => '<!DOCTYPE html>\n<html>\n\n</html>',
                'validator' => function($code) {
                    return checkHtmlStructure($code, ['html', 'head', 'body', 'title', 'h1']);
                }
            ],
            [
                'description' => 'Добавьте два абзаца текста (тег p) внутри body.',
                'template' => '<!DOCTYPE html>\n<html>\n<head>\n    <title>Страница</title>\n</head>\n<body>\n    <h1>Заголовок</h1>\n    \n</body>\n</html>',
                'validator' => function($code) {
                    $dom = new DOMDocument();
                    @$dom->loadHTML($code);
                    $paragraphs = $dom->getElementsByTagName('p');
                    
                    if ($paragraphs->length < 2) {
                        return [
                            'success' => false,
                            'message' => 'Должно быть не менее 2 абзацев (тегов p)'
                        ];
                    }
                    
                    return ['success' => true, 'message' => 'Отлично! Вы добавили достаточно абзацев.'];
                }
            ]
        ]
    ],
    [
        'title' => 'Основы CSS',
        'content' => <<<HTML
            <h3>Что такое CSS?</h3>
            <p>CSS (Cascading Style Sheets) - это язык стилей, используемый для описания внешнего вида документа, написанного на HTML.</p>
            
            <h3>Способы добавления CSS</h3>
            <p>CSS можно добавить тремя способами:</p>
            <ol>
                <li>Inline (атрибут style)</li>
                <li>Внутренние стили (тег style в head)</li>
                <li>Внешние стили (отдельный .css файл)</li>
            </ol>
            
            <h3>Пример CSS</h3>
            <pre><code class="css">body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
}

h1 {
    color: blue;
    text-align: center;
}</code></pre>
            
            <button class="button run-code" data-type="html">Запустить код</button>
            <div class="output-frame"></div>
        HTML,
        'tasks' => [
            [
                'description' => 'Добавьте CSS, который установит цвет фона body в #1a1a1a и цвет текста h1 в #6a5acd.',
                'template' => '<style>\n\n</style>',
                'validator' => function($code) {
                    $result1 = checkCssProperty($code, 'background-color', '#1a1a1a');
                    $result2 = checkCssProperty($code, 'color', '#6a5acd');
                    
                    if (!$result1['success']) return $result1;
                    if (!$result2['success']) return $result2;
                    
                    return ['success' => true, 'message' => 'Отличная работа! Стили применены правильно.'];
                }
            ]
        ]
    ],
    // Добавьте остальные 18 уроков по аналогии
    // ...
];

// Пример добавления еще одного урока
$lessons[] = [
    'title' => 'Основы JavaScript',
    'content' => <<<HTML
        <h3>Что такое JavaScript?</h3>
        <p>JavaScript - это язык программирования, который позволяет вам создавать динамически обновляемый контент.</p>
        
        <h3>Простые примеры</h3>
        <pre><code class="javascript">// Вывод в консоль
console.log('Привет, мир!');

// Переменные
let name = 'Иван';
const age = 25;</code></pre>
        
        <button class="button run-code" data-type="js">Запустить код</button>
        <div class="output-frame"></div>
    HTML,
    'tasks' => [
        [
            'description' => 'Напишите код, который объявляет переменную name со значением "Ваше имя" и выводит ее в консоль.',
            'template' => '// Ваш код здесь',
            'validator' => function($code) {
                ob_start();
                try {
                    eval($code);
                    $output = ob_get_clean();
                    
                    if (preg_match('/Ваше имя/', $output)) {
                        return ['success' => true, 'message' => 'Отлично! Вы правильно использовали console.log.'];
                    } else {
                        return [
                            'success' => false,
                            'message' => 'Код должен выводить "Ваше имя" в консоль'
                        ];
                    }
                } catch (Exception $e) {
                    ob_end_clean();
                    return ['success' => false, 'message' => 'Ошибка выполнения: ' . $e->getMessage()];
                }
            }
        ]
    ]
];
?>