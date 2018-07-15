const AemApplication = require('../lib/AemApplication')
const utils = require('./utils')

const shouldBeBundleInstallationRequest = function () {
    return utils.shouldContains([
        "Content-Disposition: form-data; name=\"bundlefile\"; filename=\"fake.zip\"",
        "Content-Disposition: form-data; name=\"action\"\r\n\r\ninstall",
        "Content-Disposition: form-data; name=\"bundlestart\"\r\n\r\nstart",
        "Content-Disposition: form-data; name=\"refreshPackages\"\r\n\r\nrefresh",
        "Content-Disposition: form-data; name=\"bundlestartlevel\"\r\n\r\n20"
    ]);
}

describe("bundle installation", () => {

    utils.testBaseCasesForFileSending({
        httpPath: '/system/console/bundles',
        httpBody: shouldBeBundleInstallationRequest,
        aemCmd: new AemApplication().installBundle
    });

})