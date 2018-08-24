const AemStub = require('./AemStub')
const assert = require('assert')
const proxyquire = require('proxyquire')

let exitFuntion = process.exit
let exitCode = 0

describe("CLI interface", () => {
    describe("Package", () => {

        test("test passing of options in installPkg",
            ['node.exe', 'aem', 'installPkg', 'some-file', '-p', '9999', '-t', '1000'],
            {
                expectedAction: 'installPkg',
                expectedConstructorOpts: { port: "9999" },
                expectedOpts: { timeout: "1000", filepath: 'some-file' }
            })

        test("test default options in installPkg",
            ['node.exe', 'aem', 'installPkg', 'some-file'],
            {
                expectedAction: 'installPkg',
                expectedConstructorOpts: { port: "4502" },
                expectedOpts: { timeout: "30", filepath: 'some-file' }
            }
        )

        testError("test exception handler in installPkg", ['node.exe', 'aem', 'installPkg', 'some-file'])

    })

    describe("OSGi", () => {
        test("test passing of options in installBundle",
            ['node.exe', 'aem', 'installBundle', 'some-file', '-p', '9999', '-t', '1000'],
            {
                expectedAction: 'installBundle',
                expectedConstructorOpts: { port: "9999" },
                expectedOpts: { timeout: "1000", filepath: 'some-file' }
            })

        test("test default options in installBundle",
            ['node.exe', 'aem', 'installBundle', 'some-file'],
            {
                expectedAction: 'installBundle',
                expectedConstructorOpts: { port: "4502" },
                expectedOpts: { timeout: "5", filepath: 'some-file' }
            })

        testError("test exception handler in installBundle", ['node.exe', 'aem', 'installBundle', 'some-file'])
    })

    describe("CRX", () => {
        test("test passing of options in remove",
            ['node.exe', 'aem', 'remove', 'path', '-p', '9999', '-t', '1000'],
            {
                expectedAction: 'remove',
                expectedConstructorOpts: { port: "9999" },
                expectedOpts: { timeout: "1000", path: 'path' }
            })

        test("test default options in remove",
            ['node.exe', 'aem', 'remove', 'path'],
            {
                expectedAction: 'remove',
                expectedConstructorOpts: { port: "4502" },
                expectedOpts: { timeout: 0, path: 'path' }
            })

        testError("test exception handler in remove", ['node.exe', 'aem', 'remove', 'some-path'])
    })

    describe("Startup", () => {
        test("test default options in start",
            ['node.exe', 'aem', 'start'],
            {
                expectedAction: 'start',
                expectedConstructorOpts: { port: 4502, quickstart: "aem-quickstart.jar", runmodes: 'author' },
                expectedOpts: { detached: undefined, additionalOpts: [], timeout: 30 }
            })

        test("test passing of options in start",
            ['node.exe', 'aem', 'start', '-q', 'some-file.jar', '-p', '9999', '-r', 'local', '-d', '-t', '1000'],
            {
                expectedAction: 'start',
                expectedConstructorOpts: { port: "9999", quickstart: "some-file.jar", runmodes: 'local' },
                expectedOpts: { detached: true, additionalOpts: [], timeout: '1000' }
            })

        testError("test exception handler in start", ['node.exe', 'aem', 'start'])

    })
})

function test(testTitle, argv, { expectedAction, expectedConstructorOpts, expectedOpts } = {}) {
    it(testTitle, () => {
        aemCli().execute(argv)

        assert.equal(AemStub.getAction(), expectedAction)
        assert.deepEqual(AemStub.getConstructorOpts(), expectedConstructorOpts)
        assert.deepEqual(AemStub.getOptions(), expectedOpts)
    })
}

function testError(title, argv) {
    it(title, (resolve) => {
        AemStub.throwException("some error")

        let cli = aemCli()
        cli.execute(argv)
        cli.promise.then(() => {
            assert.equal(exitCode, 1)
            resolve()
        })
    })
}

/*
Commander caches arguments if use the same instance, 
so we need to create new one each time like it does in reality

TODO: each test case add new execution of command, 
because list of commands are static add are duplicated on each import of index.js
*/
function aemCli() {
    let cli = proxyquire('../index', { './lib/AemApplication.js': AemStub })
    exitCode = 0
    process.exit = function (code) {
        exitCode = code
    }
    return cli;
}

process.exit = exitFuntion