FROM centos:7

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm; yum clean all

ADD . /aem-cli
WORKDIR /aem-cli
RUN npm install
RUN npm install -g

RUN aem --help