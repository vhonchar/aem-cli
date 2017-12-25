FROM centos:7

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm; yum clean all

RUN npm install -g aem-cli

RUN aem --help