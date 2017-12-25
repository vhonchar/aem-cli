FROM centos:7

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm; yum clean all

ADD lib /aem-cli/lib
ADD index.js /aem-cli/index.js
ADD package.json /aem-cli/package.json

WORKDIR /aem-cli
RUN npm install -g
RUN aem --help