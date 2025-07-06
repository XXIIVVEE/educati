document.addEventListener('DOMContentLoaded', function() {
    // Обработка отправки заданий
    document.querySelectorAll('.task-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const taskId = this.dataset.taskId;
            const code = this.querySelector('.code-editor').value;
            const resultDiv = this.querySelector('.result');
            
            // Показываем загрузку
            resultDiv.innerHTML = 'Проверяем...';
            resultDiv.className = 'result';
            resultDiv.style.display = 'block';
            
            // Отправка кода на сервер для проверки
            fetch('validator.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `task_id=${taskId}&code=${encodeURIComponent(code)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultDiv.innerHTML = '✓ ' + data.message;
                    resultDiv.className = 'result success';
                    
                    // Если есть вывод, показываем его
                    if (data.output) {
                        const outputFrame = document.createElement('div');
                        outputFrame.className = 'output-frame';
                        outputFrame.innerHTML = data.output;
                        resultDiv.appendChild(outputFrame);
                    }
                } else {
                    resultDiv.innerHTML = '✗ ' + data.message;
                    resultDiv.className = 'result error';
                }
            })
            .catch(error => {
                resultDiv.innerHTML = '✗ Ошибка при проверке задания';
                resultDiv.className = 'result error';
                console.error('Error:', error);
            });
        });
    });
    
    // Запуск кода для примеров
    document.querySelectorAll('.run-code').forEach(button => {
        button.addEventListener('click', function() {
            const code = this.previousElementSibling.textContent;
            const outputFrame = this.nextElementSibling;
            
            try {
                // Очищаем предыдущий вывод
                outputFrame.innerHTML = '';
                
                // Для HTML
                if (this.dataset.type === 'html') {
                    outputFrame.innerHTML = code;
                }
                // Для JavaScript
                else if (this.dataset.type === 'js') {
                    const originalConsoleLog = console.log;
                    let logs = [];
                    
                    console.log = function() {
                        logs.push(Array.from(arguments).join(' '));
                        originalConsoleLog.apply(console, arguments);
                    };
                    
                    // Выполняем код
                    eval(code);
                    
                    // Восстанавливаем console.log
                    console.log = originalConsoleLog;
                    
                    // Показываем логи
                    if (logs.length > 0) {
                        outputFrame.innerHTML = logs.join('<br>');
                    } else {
                        outputFrame.innerHTML = 'Код выполнен, но не было вывода в консоль.';
                    }
                }
            } catch (error) {
                outputFrame.innerHTML = 'Ошибка: ' + error.message;
            }
        });
    });
    
    // Подсветка кода при загрузке
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightBlock(block);
    });
});