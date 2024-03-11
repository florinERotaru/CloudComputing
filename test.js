const http = require('http');
const querystring = require('querystring');

function getRandomIntegers() {
    // Params array
    const params = {
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: JSON.stringify({
            apiKey: 'e50c729e-caf2-4632-9a92-09d1ae87a4b8',
            n: 6,
            min: 1,
            max: 100,
            replacement: true
        }),
        id: 42
    };

        // Encode the parameters in URL-encoded format
        const requestBody = querystring.stringify(params);
        console.log(requestBody)
        // HTTP request options
        const options = {
            hostname: 'api.random.org',
            path: '/json-rpc/4/invoke',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };
    
        const req = http.request(options, (res) => {
            let data = '';
    
            res.on('data', (chunk) => {
                data += chunk;
            });
    
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        throw new Error(response.error.message);
                    }
                    console.log('Random Integers:', response.result.random.data);
                } catch (error) {
                    console.error('Error parsing response:', error.message);
                }
            });
            
            // Retrieve the response code
            console.log('Response Code:', res.statusCode);
        });
    
        req.on('error', (error) => {
            console.error('Error fetching random integers:', error.message);
        });
    
        // Send the request body
        req.write(requestBody);
        req.end();
    }
    
    getRandomIntegers();