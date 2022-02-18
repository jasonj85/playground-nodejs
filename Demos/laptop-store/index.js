const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // products list
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {'Content-type' : 'text/html'});

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overview = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsList = laptopData.map(el => replaceTemplate(data, el)).join('');
                overview = overview.replace('{%CARDS%}', cardsList);
                
                res.end(overview);
            });
        });
    }
    // laptop details
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type' : 'text/html'});

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop)
            res.end(output);
        });
    }
    // load images
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type' : 'image/jpg'});
            res.end(data);
        })
    }
    // url not found 
    else {
        res.writeHead(404, {'Content-type' : 'text/html'});
        res.end('URL was not found on the server');    
    }

});

server.listen(3000, '127.0.0.1', () => {
    console.log('Listening to requests');
});

function replaceTemplate(originalHTML, laptop)
{
    let output =  originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output =  output.replace(/{%PRICE%}/g, laptop.price);
    output =  output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output =  output.replace(/{%IMAGE%}/g, laptop.image);
    output =  output.replace(/{%SCREEN%}/g, laptop.screen);
    output =  output.replace(/{%CPU%}/g, laptop.productName);
    output =  output.replace(/{%STORAGE%}/g, laptop.storage);
    output =  output.replace(/{%RAM%}/g, laptop.ram);
    output =  output.replace(/{%ID%}/g, laptop.id);

    return output;
}