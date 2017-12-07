from fabric.api import *

env.hosts = ['root@60.205.183.134']

image_repo = 'registry.cn-hangzhou.aliyuncs.com/powerformer/face-fusion'
container_name = 'face_fusion'


def build_and_push_image():
    """Build docker image from the code and push to registry."""
    local("docker build -t %s ." % image_repo)
    local("docker push %s" % image_repo)


def pull_image_and_redeploy():
    """Pull the newest image from registry."""
    # Pull the newest image
    run("docker pull %s" % image_repo)

    running_containers = run("docker ps --format {{.Names}}").split()
    if container_name in running_containers:
        # The image already has a running container
        # So we need to remove it
        run("docker rm -f %s" % container_name)

    # Run a container with the updated image and restart proxy
    run("docker run -d -p 10000:80 --name %s %s" % (container_name, image_repo))


@task
def deploy_with_private_key():
    build_and_push_image()
    pull_image_and_redeploy()


@task
def deploy():
    local("fab deploy_with_private_key -i pf.pem")
