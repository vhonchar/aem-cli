const AemStub = require('./AemStub')
const assert = require('assert')
const proxyquire = require('proxyquire')

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

    })
})

function test(testTitle, argv, { expectedAction, expectedConstructorOpts, expectedOpts } = {}) {
    it(testTitle, () => {
        aemCli(argv)

        assert.equal(AemStub.getAction(), expectedAction)
        assert.deepEqual(AemStub.getConstructorOpts(), expectedConstructorOpts)
        assert.deepEqual(AemStub.getOptions(), expectedOpts)
    })
}

/*
Commander caches arguments if use the same instance, 
so we need to create new one each time like it does in reality

TODO: each test case add new execution of command, 
because list of commands are static add are duplicated on each import of index.js
*/
function aemCli(args) {
    return proxyquire('../index', { './lib/AemApplication.js': AemStub })(args)
}