# -*- coding: utf-8 -*-
"""
Powerformer client fabric script.

Available commands:
- `fab build`: Run react build scripts, upload static assets to OSS, and replace links
in HTML meanwhile.
- `fab start`：Run the build locally with docker-compose.
- `fab deploy:1.0.0`: Handle the whole process of building, pushing and pulling docker
image, and (re)deploy the container.
"""

from __future__ import with_statement

from datetime import datetime

from fabric.api import *
from fabric.colors import green

import oss2

env.hosts = ['root@60.205.183.134']

image_repo = 'registry.cn-hangzhou.aliyuncs.com/powerformer/face-fusion'
container_name = 'face_fusion'
oss_vendor = 'http://oss-cn-hangzhou.aliyuncs.com'
bucket_url = 'http://face-fusion.oss-cn-hangzhou.aliyuncs.com/'


def read_api_auth():
    """Read API Access Key so as to control OSS service."""
    with open('ACCESS_KEY') as fp:
        keys = fp.readlines()
    return oss2.Auth(keys[0], keys[1])


def collect_static_files():
    """Capture names of static files needed to be uploaded."""
    static_files = []

    for filename in local("ls build/static/css", capture=True).split():
        static_files.append('static/css/' + filename)

    for filename in local("ls build/static/js", capture=True).split():
        static_files.append('static/js/' + filename)

    for filename in local("ls build/static/media", capture=True).split():
        static_files.append('static/media/' + filename)

    return static_files


def upload_to_oss(static_files):
    """Upload static assets to OSS via SDK."""
    # Initialize api auth with access key
    print "Reading api auth keys ...",
    auth = read_api_auth()
    print(green("Done"))

    bucket = oss2.Bucket(auth, oss_vendor, 'face-fusion')

    # Delete existing outdated static assets
    print "Deleting existing outdated static assets in OSS ...",
    bucket.delete_object('static')
    print(green("Done"))

    print "Uploading latest static assets ...",
    for static_file in static_files:
        bucket.put_object_from_file(static_file, 'build/' + static_file)
    print(green("Done"))


def replace_links(static_files):
    """Replace links of static assets in index page."""
    print "Replacing links in index.html ...",
    with open('build/index.html') as fp:
        filedata = fp.read()

    for static_file in static_files:
        filedata = filedata.replace('/' + static_file, bucket_url + static_file)

    # Write the modified html code back
    with open('build/index.html', 'w') as fp:
        fp.write(filedata)

    print(green("Done"))


def pull_image_and_redeploy():
    """Pull the newest image from Docker Hub and redeploy the container."""
    # Pull the newest image
    run("docker pull %s" % image_repo)

    running_containers = run("docker ps --format {{.Names}}").split()
    if container_name in running_containers:
        # The image already has a running container
        # So we need to remove it
        run("docker rm -f %s" % container_name)

    # Run a container with the updated image
    run("docker run -d -p 10000:80 --name %s --restart=always %s"
        % (container_name, image_repo))


def build():
    """
    Run react build scripts and upload static assets to OSS,
    and replace links in HTML meanwhile.
    """
    local("npm run build")

    static_files = collect_static_files()
    upload_to_oss(static_files)
    replace_links(static_files)


def deploy_with_private_key():
    """
    Build the project, handle the whole process of docker image,
    and (re)deploy the container.
    """
    # Build and push the image
    build()
    local("docker build -t %s ." % (image_repo))
    local("docker push %s" % (image_repo))

    pull_image_and_redeploy()


def deploy():
    """Simplify deploy command from `fab deploy -i pf.pem` to `fab deploy`."""
    local("fab deploy_with_private_key -i pf.pem")
