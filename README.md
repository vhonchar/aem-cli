# AEM-CLI

Have you tried to create docker image for your lovely AEM? <br/>
AEM CLI gives you ability to install AEM in a following manner:
```
aem start -q AEM_6.3_quickstart.jar -p 4502 -r author --detached
aem installPkg package-with-SP1.zip
aem stop 4502
```

## aem start

Usage: `aem start [options]`

Starts or installs AEM from specified quickstart file and waits until startup is completed.

Options:

```
-p, --port <port>              AEM port (default: 4502)
-r, --runmodes <runmodes>      Comma separated runmodes (default: author)
-q, --quickstart <quickstart>  Path to quickstart jar file (default: aem-quickstart.jar)
-d, --detached                 Whether to start AEM in detached mode
-t, --timeout <timeout>        Timeout in seconds after installation (default: 30)
-h, --help                     output usage information
```

Example: `aem start -q AEM_6.3_quickstart.jar -p 4502 -r author --detached`

Explanation: starts AEM from AEM_6.3_quickstart.jar on port 4502 with author runmode in separated OS process.

**NOTE**<br>
This command will wait until startup is finished if run with detached option.

## aem installPkg 

Usage: `aem installPkg [options] <zipFile>`

Upload specified ZIP file to AEM and install it.

Options:

```
-p, --port <port>        AEM port (default: 4502)
-t, --timeout <timeout>  Timeout in seconds after installation (default: 30)
-h, --help               output usage information
```

## aem stop

Usage: `aem stop [options] <port>`

Stop AEM processes (including sub-processes) and wait until all are exit.

Options:
```
-s, --signal <signal>  The signal to send, either as a string or number. (default: SIGINT)
-h, --help             output usage information
```



