# This image provides a Python 3.5 environment you can use to run your Python
# applications.
FROM centos/s2i-base-centos7

MAINTAINER William Chang <warmchang@outlook.com>

EXPOSE 8080

ENV PYTHON_VERSION=3.5 \
    PATH=$HOME/.local/bin/:$PATH

LABEL io.k8s.description="Platform for building and running Python 3.5 applications" \
      io.k8s.display-name="Python 3.5" \
      io.openshift.expose-services="8080:http" \
      io.openshift.tags="builder,python,python35,rh-python35"

# RUN yum install -y centos-release-scl-rh && \
#     yum-config-manager --enable centos-sclo-rh-testing && \
#     INSTALL_PKGS="rh-python35 rh-python35-python-devel rh-python35-python-setuptools rh-python35-python-pip \
#      nss_wrapper httpd httpd-devel atlas-devel gcc-gfortran libffi-devel libtool-ltdl libxslt-devel" && \
#     yum install -y --setopt=tsflags=nodocs --enablerepo=centosplus $INSTALL_PKGS && \
#     rpm -V $INSTALL_PKGS && \
#     # Remove centos-logos (httpd dependency, ~20MB of graphics) to keep image
#     # size smaller.
#     rpm -e --nodeps centos-logos && \
#     yum clean all -y

RUN yum install -y centos-release-scl && \
    yum-config-manager --enable rhel-server-rhscl-7-rpms && \
    INSTALL_PKGS="rh-python35 rh-python35-python-devel rh-python35-python-setuptools rh-python35-python-pip \
     nss_wrapper httpd httpd-devel atlas-devel gcc-gfortran libffi-devel libtool-ltdl libxslt-devel" && \
    yum install -y $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    # Remove centos-logos (httpd dependency, ~20MB of graphics) to keep image
    # size smaller.
    rpm -e --nodeps centos-logos && \
    scl enable rh-python35 bash && \
    yum clean all -y

COPY ./ /

# In order to drop the root user, we have to make some directories world
# writable as OpenShift default security model is to run the container under
# random UID.
RUN chown -R 1001:0 /opt/app-root && chmod -R og+rwx /opt/app-root

USER 1001

# Set the default CMD to print the usage of the language image.
CMD python ./SmartStock/manage.py runserver 0.0.0.0:8080
