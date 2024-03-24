var http = require('http'); //import module
const path = require('path');
const url = require('url');
const movies = 'd:\\UNI 3.0 IASI\\cloud\\tema2\\backend\\movies-1990s.json'
const fs = require('fs');
const { json } = require('stream/consumers');
 
function movieServiceMiddleware(req, res, next) {
    console.log(req.method)
    console.log(req.url)

    var body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    }); //this is executed only when there is a body in the request.


    req.on('end', () => {
        try{
            if (req.method == 'PUT'){
                if(req.url == '/change'){
                    res.writeHead(405, {'Content-Type': 'text/plain'});
                    res.end('Updating the entire resource not allowed.');
                    return;
                } else {
                    if(req.url == '/update'){
                        body = JSON.parse(body)
                        feedback = updateMovie(movies, body)
                        console.log("succ fb")
                        switch(feedback){
                            case 0:
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify(body));
                                return;
                            case 1:
                                res.writeHead(204, {'Content-Type': 'text/plain'});
                                res.end('No content in the config');
                                return;
                            case -1:
                                res.writeHead(404, {'Content-Type': 'text/plain'});
                                res.end('Targeted resource not found');
                                return;
                       
                        }
                    }
                }
            }
            if(req.method == 'POST' && req.url == '/add'){
                body = JSON.parse(body)
                feedback = addMovie(movies, body)
                switch(feedback){
                    case 0:
                        res.writeHead(201, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(body));
                        break;
                    case 1:
                        res.writeHead(400, {'Content-Type': 'text/plain'});
                        res.end('Insufficient information, title, year and genre minimal requirements.');
                        break;
                    case -1:
                        res.writeHead(409, {'Content-Type': 'text/plain'});
                        res.end('Conflict, resource with given title already exists')
                        break;
                }
                return;
            }
            const parsedUrl = url.parse(req.url, true);
            const title = parsedUrl.query.title;
            if (req.method == 'DELETE'){
                if(req.url == '/delete'){
                    res.writeHead(405, {'Content-Type': 'text/plain'});
                    res.end('Deleting all movies is not allowed.');
                    return;
                } else if(new RegExp('^\/delete.*').test(req.url) && title){
                    feedback = deleteMovieByName(movies, title)
                    if (feedback == null){
                        res.writeHead(404, {'Content-Type': 'text/plain'});
                        res.end('Movie not found.');
                        return;
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(feedback));
                        return;
                    }
                }
            }
            if (req.method == 'GET'){
                if (new RegExp('^\/movies.*').test(req.url)){
                    const actor = parsedUrl.query.actor;
                    console.log(title, actor)
                    if (title){
                        console.log('title branch')
                        feedback = findByTitle(movies, title)
                        if (feedback){
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(feedback));
                            return;
                        } else {
                            res.writeHead(404, {'Content-Type': 'text/plain'});
                            res.end('No movies found with the given title.');
                            return;
                        }
                    } else if (actor){
                            console.log('actor branch')
                            feedback = findMoviesByActor(movies, actor)
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(feedback));
                            return;
                    }else {
                        fs.readFile(movies, 'utf8', (err, data) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Error reading movies file.');
                                console.error(err);
                            } else {
                                const moviesData = JSON.parse(data);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(moviesData));
                            }
                        });
                        return;
                    }
            }
        }
            //default case:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Page not found.');
            console.log("Default 404 triggered")
        }catch (error) {
            console.log(error)
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal Server Error  -   ');

        }

    });

}

module.exports = movieServiceMiddleware;

function findByTitle(file, title){
    if(!title){
        title = ''
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const titleLower = title.toLowerCase();
    const movie_set = data.filter(movie => movie.title.toLowerCase() === titleLower);
    if (movie_set.length == 0)
        return null
    return movie_set
}

function findMoviesByActor(file, actor) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const actorLower = actor.toLowerCase();
    console.log(data[1].cast)

    const moviesWithActor = data.filter(movie => {
        if (movie.cast && Array.isArray(movie.cast)) {
            return movie.cast.map(a => a.toLowerCase()).includes(actorLower);
        } else {
            return false;
        }
    });
    return moviesWithActor;
}


function deleteMovieByName(file, title) {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const index = data.findIndex(movie => movie.title.toLowerCase() === title.toLowerCase());
    console.log(title)
    console.log(index)
    if (index != -1) {
        const deletedMovie = data[index];
        data.splice(index, 1);
        fs.writeFileSync(file, JSON.stringify(data, null, 2));

        return deletedMovie; 
    } else {
        return null; 
    }
}


function addMovie(file, movieBody){
    let data = JSON.parse(fs.readFileSync(file, 'utf8'))

    if (movieBody.title != null && movieBody.year != null && movieBody.genres != null){
        if (findByTitle(file, movieBody.title.toString()) != null){
            return -1; //conflict
        }
        data.push(movieBody)
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return 0 // ok
    }
    return 1    //1 - insufficient information
}

function updateMovie(file, updateConfig){
    console.log(updateConfig)
    let data = JSON.parse(fs.readFileSync(file, 'utf8'))
    if (updateConfig.title == null || Object.keys(updateConfig).length <= 1){
        console.log("ins info")
        return 1 // isufficient information
    }
    const index = data.findIndex(movie => movie.title.toLowerCase() === updateConfig.title.toLowerCase());
    if (index == -1){
        console.log("not found")
        return -1; //not found
    }
    const newObject = data[index];
    for (const key in updateConfig) {
        if (key != 'title') {
            newObject[key] = updateConfig[key];
        }
    }
    data[index] = newObject;
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log("ok")
    return 0 // ok
}