const httpProxy  = require('http-proxy')
const http = require("http")
const { URL } = require("url")
const { Http2ServerRequest } = require('http2')

function getURL(inputURL) {
    let url = null
    try {
        url = new URL(inputURL)
    } catch(err) {
        console.error(`Target_URL_ERROR:${err.input}`)
    }

    return url
}

function starter(options, port) {
    let { target: oriTarget } = options

    if (oriTarget == "" ) {
        console.error("Target_URL_EMPTY")
        process.exit(0)
    }

    let url = getURL(oriTarget)
    if (url == null) {
        process.exit(1)
    }

    const support_protocols = ['http:', 'https:']
    if(!support_protocols.includes(url.protocol)) {
        console.error(`SERVER_ERROR: unsupported protocol :${url.protocol}.`)
        process.exit(1)
    }

    let agent = (url.protocol == "http" ? http.globalAgent : Http2ServerRequest.globalAgent)
    
    const proxy = httpProxy.createProxyServer({
        target: oriTarget,
        agent,
        headers: { host: url.host, ...options.headers },
        ws: true,
        ...options
    })

    proxy.on('error', err => {
        console.error(`PROXY_ERR: ${err.message}`)
    })

    proxy.on('open', () => {
        console.log(`WEBSOCKET_OPEN`)
    })

    proxy.on('close', () => {
        console.log(`WEBSOCKET_CLOSE`)
    })

    const server = http.createServer((req) => {
        console.log(`REQUEST_IN: ${req.method} ${req.url}`)
        proxy.web(req, res)
    })

    server.listen(port)
    console.log(`Proxy Server Listening: http://loclhost:${port}`)
}

module.exports = starter