const path = require('path')
//Подключает env к проекту
const env = require('dotenv').config()

const fastify = require('fastify')({
    logger: true
})

const options = {
    addToBody: true,
    sharedSchemaId: 'MultipartFileType',
    /*onFile: (fieldName, stream, filename, encoding, mimetype, body) => {
        console.log(body)
        stream.resume()
    },*/
    //limit: { fileSize: 1} // You can the limit options in any case
}
fastify.register(require('fastify-multipart'), options)
fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})
fastify.register(require('fastify-cookie'), {
    secret:       process.env.COOKIE_SECRET,
    parseOptions: {},
});
fastify.register(require('fastify-autoload'), {
    dir: path.join(__dirname, './routes')
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // fastify.log.info(`server listening on ${address}`);
})
