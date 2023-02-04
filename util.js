const toml = require('toml')
const fs = require('fs')

function getConfig(configFilePath) {
    let config = null
    try {
        const data = fs.readFileSync(configFilePath, 'utf-8')
        config = toml.parse(data)
    } catch(err) {
        console.error(`SERVER_ERROR: ${err.message}`)
    }
    return config
}

const  defaultConfig = `
target = "https://api.openweathermap.org/data/2.5/weather"

[headers]
`

module.exports = { getConfig, defaultConfig }