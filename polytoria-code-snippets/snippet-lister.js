const glob = require('glob')

async function main() {
    const glo = await glob('snippets/**/*')

    let result = []

    for (const g of glo) {
        result.push(
            {
                "language": "lua",
                "path": g
            }
        )
    }

    console.log(JSON.stringify(result))
}

main()