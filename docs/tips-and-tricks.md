## Timeouts

In all commands you may find one common option: **timeout**, with different default values.  
Yes, each command will synchronously wait for some time after its execution.  
This were introduced since we can't say what will happen inside of AEM after installation of package/bundle or anything else.
For example when we install Service Pack which may restart all bundles in OSGi and start some indexing.
So the easiest way - just wait for some time.

## URLs instead of paths

Commands to install package and bundle supports URLs like a source path for package/bundle to install.
**Use it.**