var http = require('http'),
    stores = {};

http.createServer(function (req, res) {
    cors(req, res, function() {
        var store = getStore(req.url);

        if(req.method == 'POST') {
            store.data = '';
            store.type = req.headers['content-type'];

            req.on('data', function(chunk) {
                store.data += chunk.toString();
            });

            req.on('end', function() {
                res.writeHead(200);
                res.end();
            });
        }
        else {
            res.writeHead(200, {'Content-Type': store.type});
            res.end(store.data);
        }
    });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

function getStore(name) {
    if(!stores[name]) {
        stores[name] = {
            data: '',
            type: 'text/plain'
        };
    }
    return stores[name];
}

function cors(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.setHeader('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
}
