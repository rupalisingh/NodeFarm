// const hello = 'hello world'
// console.log(hello)

const fs = require('fs')
const http = require('http')
const url = require('url') // Analyze the url during routing

////////////////FILES////////////

// Synchronous Code (Blocking)

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)

// const textOut = `This is what we know about the avacado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log("File WRITTEN")

// Non-BLocking/ Asynchronous

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("Your file has been written")
//             })
//         })
//     })

// })

// console.log("Will read File")


/////////////SERVER ////////////////

const tempOverview = fs.readFileSync('./templates/overview.html')
const tempCard = fs.readFileSync('./templates/template-card.html')
const tempProduct = fs.readFileSync('./templates/product.html')
const data = fs.readFileSync('./dev-data/data.json', 'utf-8')
const dataObj = JSON.parse(data)


//below codes will execute each time a request is made

const server = http.createServer((req, res) => {
    console.log(req.url)
    // console.log(url.parse(url.parse(req.url, true)))
    const {query, pathname} = url.parse(req.url, true)
    // const pathname = req.url

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })

        /// In arrow function if curly braces are not present then the function automatically returns the expected value
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        console.log(cardsHtml)
        res.end(output)
    } else if (pathname === '/product') {
        const product = dataObj[query.id]
        res.writeHead(200, {'Content-type' : 'text/html'})
        const output = replaceTemplate(tempProduct, product)
        // console.log(query)
        res.end(output)
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end("<h1>Page Not Found</h1>")
    }
})

// Listen the request from server at this port
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on Port 8000')
})


