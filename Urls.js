// при получении сообщения от сайта, указанного в "matches", запускается скрипт
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        // проверяем, что пришло именно то сообщение, которое требуется для запуска
        if (request.openUrlInEditor === "ShowHistory") {
            var dayStart = new Date();
            // 30 дней назад
            dayStart.setDate(dayStart.getDate()-30);
            dayStart.setHours(0);
            dayStart.setMinutes(0);
            dayStart.setSeconds(0);
            dayStart.setMilliseconds(0);
            // поиск истории по заданным параметрам, можем варьировать максимальное количество URL. Для удобства тестирования задала 10
            chrome.history.search({'text': 'https://*', 'startTime': dayStart.getTime(), 'maxResults': 10}, addURLs);
            // считываем дату из локального зранилища, которую записала функция addURLs
            var my_data = localStorage.getItem("url");
            // запускаем на активной вкладке скрипт из файла new_script.js
            chrome.tabs.executeScript(null, {
                code: 'var my_data = ' + JSON.stringify(my_data) + ' ;'
            }, function () {
                chrome.tabs.executeScript(null, {file: "new_script.js"});
            });
        }
    }
);

function addURLs(historyItems) {
    var str = "";
    for (var i = 0; i < historyItems.length; i++) {
        str = str + "," + historyItems[i].url;
    }
    str = str.slice(1);
    // в локальное хранилище браузера помещается строка с данными - записали полученные URL-адреса
    localStorage.setItem("url", str) ;
}

