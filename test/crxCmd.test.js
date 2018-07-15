const AemApplication = require('../lib/AemApplication')
const utils = require('./utils')
const nock = require('nock')

describe("CRX", () => {

    utils.testBaseCasesForHttpRequests({
        httpMethod: "delete",
        httpPath: "/content/site/page",
        aemCmd: new AemApplication().remove,
        aemCmdArgs: ["/content/site/page", utils.disabledTimeout]
    })
})

