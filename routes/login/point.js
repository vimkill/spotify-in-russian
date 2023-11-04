const job = require("../../handlers/login/handler")

module.exports = function (fastify, opts, next) {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            // let ch = await checkTokenAndSetRequest(request)
            // console.log(ch)
            // if (!ch) {
            //     reply.code(403)
            //     reply.send({message: 'Access denied', statusCode: 403})
            // }
        } catch (e) {
            console.error(e)
        }
    })
    fastify.route({
        method: 'GET',
        url: '/getUserData',
        async handler(request, reply) {
            const data = await job.getUserData()
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    next()
}