// Imports
const { load } = require("cheerio")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs-extra')

main() // Express all your hate to this main function

async function scrapeMagnets(url, cacheLoc) {
    const res = await fetch(url)
    const j = await res.text()
    const json = JSON.parse(j)
    
    // Creates a template where data will be pushed eventually
    const template = {
        "requests": [
        ]
    }

    const products = json.products

    if (products.length === 0) {
        console.log('\nGame/DLC not found. (Perhaps you typed it wrong?)')
        process.exit()
    }
    
    // For loop, will loop through every object inside a array
    // Afterwards, collects the data and stores inside a var named data
    // Then, pushes the data to "template"
    for(var i = 0; i < products.length; i++) {
        var prod = json.products[i]
        var data = {
            gameDev: prod.developer,
            gamePub: prod.publisher,
            gameTitle: prod.title,
            price: `${prod.price.symbol}${prod.price.amount}`,
            basePrice: `${prod.price.symbol}${prod.price.baseAmount}`
        }

        template.requests.push(data)
    }

    // Writes the data to the file located at the cache var
    fs.writeFileSync(cacheLoc, JSON.stringify(template))
    console.log("\nWrote data successfully!")
}

function main() {
    // Creates 2 constants: query and cache
    const query = process.argv[2]
        .replace("--query=", "")
        .toLowerCase()
        .split(' ').join('%20')
        .replace("\'", "")
    
    const cache = process.argv[3]
        .replace("--cache=", "")

    // Logs them for fun
    console.log(`Query: ${query}\nCache: ${cache}`)
    scrapeMagnets(`https://embed.gog.com/games/ajax/filtered?mediaType=game&search=${query}`, cache)
}