const request = require('request');
request('http://www.google.com', (err, res, body) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('status code', res && res.statusCode)
    console.log('body:', body);
});
