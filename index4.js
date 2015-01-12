document.addEventListener('DOMContentLoaded', function() {
    var listEl = document.querySelector('#list'),
        newBtn = document.querySelector('#new'),
        saveBtn,
        loadBtn,
        list = [],
        id = 0;

    newBtn.addEventListener('click', function() {
        var item = {text: ''};
        list.push(item);
        renderItem(item);
    });

    listEl.addEventListener('click', function(e) {
        var id;
        if(id = e.target.getAttribute('data-delete')) {
            list.some(function(item, idx) {
                if(item.id == id) {
                    item.el.parentNode.removeChild(item.el);
                    list.splice(idx, 1);
                    return true;
                }
            });
        }
    });

    saveBtn = document.createElement('button');
    saveBtn.innerText = 'Save';
    saveBtn.addEventListener('click', function() {
        $.ajax('http://localhost:1337/', {
            data: JSON.stringify(list.map(function(item) {
                return {
                    text: item.el.querySelector('input').value
                };
            })),
            type: 'POST'
        }).done(function() {
            saveBtn.innerText = 'Save';
            saveBtn.disabled = false;
        });

        saveBtn.innerText = 'Saving...';
        saveBtn.disabled = true;
    });
    newBtn.parentNode.appendChild(saveBtn);

    loadBtn = document.createElement('button');
    loadBtn.innerText = 'Load';
    loadBtn.addEventListener('click', load);
    newBtn.parentNode.appendChild(loadBtn);

    load();

    function load() {
        $.ajax('http://localhost:1337/').done(function(data) {
            loadBtn.innerText = 'Load';
            loadBtn.disabled = false;
            list = JSON.parse(data);

            listEl.innerHTML = '';
            list.forEach(renderItem);
        });
        loadBtn.innerText = 'Loading...';
        loadBtn.disabled = true;
    }

    function renderItem(item) {
        item.id = id++;
        item.el = document.createElement('div');
        item.el.innerHTML = '<input type="text"><button data-delete="' + item.id + '">Delete</button>';
        item.el.querySelector('input').value = item.text;
        listEl.appendChild(item.el);
    }
});
