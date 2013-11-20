document.addEventListener('DOMContentLoaded', function() {
    var listEl = document.querySelector('#list'),
        newBtn = document.querySelector('#new'),
        saveBtn,
        list = [],
        id = 0;

    if(localStorage.notes) {
        list = JSON.parse(localStorage.notes);
        list.forEach(renderItem);
    }

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
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', function() {
        localStorage.notes = JSON.stringify(list.map(function(item) {
            return {
                text: item.el.querySelector('input').value
            };
        }));
    });
    newBtn.parentNode.appendChild(saveBtn);

    function renderItem(item) {
        item.id = id++;
        item.el = document.createElement('div');
        item.el.innerHTML = '<input type="text"><button data-delete="' + item.id + '">Delete</button>';
        item.el.querySelector('input').value = item.text;
        listEl.appendChild(item.el);
    }
});
