#!/usr/bin/env node
const program = require('commander');
const AemApplication = require('./lib/AemApplication.js');
const terminate = require('terminate');
const ps = require('ps-node');

program
    .command('start')
    .description('Starts or installs AEM from specified quickstart file and waits until startup is completed.')
    .option('-p, --port <port>', 'AEM port', 4502)
    .option('-r, --runmodes <runmodes>', 'Comma separated runmodes', 'author')
    .option('-q, --quickstart <quickstart>', 'Path to quickstart jar file', 'aem-quickstart.jar')
    .option('-d, --detached', 'Whether to start AEM in detached mode')
    .option('-t, --timeout <timeout>', 'Timeout in seconds after installation', 30)
    .action(function (options) {
        new AemApplication({
            quickstart: options.quickstart,
            port: options.port,
            runmodes: options.runmodes
        }).start(options.detached, [], options.timeout)
            .then(process => {
                console.log('AEM is started. PID is ' + process.pid)
            }).catch(handleRejection)
    })

program
    .command('stop <port>')
    .description('Stop AEM processes (including sub-processes) and wait until all are exit.')
    .option('-s, --signal <signal>', 'The signal to send, either as a string or number.', 'SIGINT')
    .action(function (port, options) {
        ps.lookup({
            command: 'java',
            arguments: '-p,' + port
        }, function (err, resultList) {
            if (err) {
                throw new Error(err);
            }
            resultList.forEach(function (process) {
                if (process) {
                    console.log('Stopping PID: %s, command: %s, arguments: %s', process.pid, process.command, process.arguments);
                    new AemApplication()
                        .stop(process.pid, options.signal)
                        .catch(handleRejection)
                }
            });
        });
    })

program
    .command('installBundle <bundle>')
    .description('Installs specified bundle to AEM. Supports URL as source.')
    .option('-p, --port <port>', 'AEM port', 4502)
    .option('-t, --timeout <timeout>', 'Timeout in seconds after installation', 5)
    .action((bundle, options) => {
        new AemApplication({ port: options.port })
            .installBundle(bundle, options.timeout)
            .catch(handleRejection)
    })

program
    .command('installPkg <zipFile>')
    .description('Upload specified ZIP file to AEM and install it. Supports URL as source.')
    .option('-p, --port <port>', 'AEM port', 4502)
    .option('-t, --timeout <timeout>', 'Timeout in seconds after installation', 30)
    .action((zipFile, options) => {
        new AemApplication({ port: options.port })
            .installPkg(zipFile, options.timeout)
            .catch(handleRejection)
    })

program
    .command('remove <path>')
    .description('Removes specified path in CRX.')
    .option('-p, --port <port>', 'AEM port', 4502)
    .option('-t, --timeout <timeout>', 'Timeout in seconds after installation', 0)
    .action((path, options) => {
        new AemApplication({ port: options.port })
            .remove(path, options.timeout)
            .catch(handleRejection)
    })

function handleRejection(e) {
    console.error(e.stack || e)
    // Throw exception in separated event to avoid unhandled rejected promise error
    setTimeout(function () { throw e; });
}

// for testing purpose
module.exports = () => {
    program.parse(process.argv)
}

program.parse(process.argv);