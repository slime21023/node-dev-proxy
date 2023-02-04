#!/usr/bin/env node

const sade = require('sade')
const proxyStarter =  require('../index')
const fs = require('fs')
const path = require('path')
const { getConfig, defaultConfig } = require('../util')

const { version } = require("../package.json")

const prog = sade('dev-proxy')
prog.version(version)

prog.command("run")
    .describe("Run the proxy.")
    .option("-p --port", 'port', 7000)
    .option("-f --file", 'the config file path')
    .example("dev-proxy run")
    .action((opts) => {
        const { file, port } = opts
        
        let hasFile = (file && file != '')
        let config = getConfig( hasFile ? file : path.join(process.cwd(), "dev-proxy.toml") )
        
        const { target = '', headers = {}} = config
        let options = {
            target,
            headers,
            ...config
        }
        proxyStarter(options, port)
    })

prog.command("init")
    .describe("Create the proxy defalut config file.")
    .example("dev-proxy init")
    .action(() => {
        let config = defaultConfig
        let targetPath = path.join(process.cwd(), 'dev-proxy.toml')
        try {
            fs.writeFileSync(targetPath, config)
        } catch(err) {
            console.error(err.message)
        }
    })

prog.parse(process.argv)