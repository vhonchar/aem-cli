const nock = require('nock')
const AemApplication = require('../lib/AemApplication')

module.exports = {

    /**
     * Timeout for all commands.
     * Default is 30 seconds, but test will be failed if execution is more than 2 seconds.
     */
    disabledTimeout: 0,

    /**
     * Accept any body in request.
     * For HTTP mocking via nock.
     */
    anyBody: true,

    existingFilePath: "test/resources/fake.zip",

    shouldContains: function (strings) {
        return function (body) {
            let total = true;
            strings.forEach(string => {
                total = total && body.indexOf(string) > -1
            });
            return total;
        }
    },

    testBaseCasesForFileSending: function ({ httpPath, httpBody, aemCmd }) {

        this.testBaseCasesForHttpRequests({
            httpMethod: "post",
            httpPath: httpPath,
            httpBody: httpBody,
            aemCmd: aemCmd,
            aemCmdArgs: [this.existingFilePath, this.disabledTimeout]
        })

        it("should reject if no file found", (done) => {
            nock('http://localhost:4502')
                .post(httpPath, this.anyBody)
                .reply(200, 'Done')

            aemCmd.apply(new AemApplication(), ['not-existing-file.jar', this.disabledTimeout])
                .then(() => done("Should fail"))
                .catch(() => done());
        })
    },

    testBaseCasesForHttpRequests: function ({ httpMethod, httpPath, httpBody, aemCmd, aemCmdArgs }) {

        it("should send correct request to localhost", (done) => {
            nock('http://localhost:4502')
                .intercept(httpPath, httpMethod, httpBody)
                .reply(200, 'Done');

            aemCmd.apply(new AemApplication(), aemCmdArgs)
                .then(done)
                .catch((e) => done("error " + e));
        })

        it("should send correct request to another host", (done) => {
            nock('https://another-domain:80')
                .intercept(httpPath, httpMethod, httpBody)
                .reply(200, 'Done');

            aemCmd.apply(new AemApplication({ url: 'https://another-domain', port: '80' }), aemCmdArgs)
                .then(done)
                .catch((e) => done("error " + e));
        })

        it("should reject if status is not 200", (done) => {
            nock('http://localhost:4502')
                .intercept(httpPath, httpMethod, this.anyBody)
                .replyWithError("Error was here")

            aemCmd.apply(new AemApplication(), aemCmdArgs)
                .then(() => done("Should fail"))
                .catch(() => done());
        })
    },

}