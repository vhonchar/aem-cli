const AemApplication = require('../lib/AemApplication')
const utils = require('./utils')

const shouldBePackageInstallationRequest = function () {
    return utils.shouldContains([
        "Content-Disposition: form-data; name=\"file\"; filename=\"fake.zip\"",
        "Content-Type: application/octet-stream",
        "Content-Disposition: form-data; name=\"force\"",
        "Content-Disposition: form-data; name=\"install\""
    ])
}

describe("package installation", () => {

    utils.testBaseCasesForFileSending({
        httpPath: '/crx/packmgr/service.jsp',
        httpBody: shouldBePackageInstallationRequest,
        aemCmd: new AemApplication().installPkg
    });

})

