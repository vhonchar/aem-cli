const assert = require('assert')
const AemApplication = require('../lib/AemApplication')

describe("common behavior aem application", () => {

    it("test default config", () => {
        let actual = new AemApplication();

        assert.equal(actual.url, 'http://localhost')
        assert.equal(actual.quickstart, 'quickstart.jar')
        assert.equal(actual.port, '4502')
        assert.equal(actual.runmodes, 'author,nosamplecontent')
        assert.deepEqual(actual.opts, {
            url: 'http://localhost',
            quickstart: 'quickstart.jar',
            port: '4502',
            runmodes: 'author,nosamplecontent',
            user: 'admin',
            pass: 'admin'
        })
    })

    it("test overriding of default config", () => {
        let actual = new AemApplication({
            url: "https://another-domain",
            quickstart: "path/to/file",
            port: "80",
            runmodes: "publisher",
            user: "user",
            pass: "pass"
        });

        assert.equal(actual.url, "https://another-domain")
        assert.equal(actual.quickstart, "path/to/file")
        assert.equal(actual.port, "80")
        assert.equal(actual.runmodes, "publisher")
        assert.deepEqual(actual.opts, {
            url: "https://another-domain",
            quickstart: "path/to/file",
            port: "80",
            runmodes: "publisher",
            user: "user",
            pass: "pass"
        })
    })

})