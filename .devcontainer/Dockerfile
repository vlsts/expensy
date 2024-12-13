FROM debian:12

RUN apt update

RUN apt install curl git bash binutils git xz-utils wget sudo -y

RUN wget --output-document=/dev/stdout https://nixos.org/nix/install | sh -s -- --daemon
RUN . ~/.nix-profile/etc/profile.d/nix.sh

ENV PATH="/home/root/.nix-profile/bin:$PATH"

RUN wget --quiet --output-document=/dev/stdout https://get.jetify.com/devbox | bash -s -- -f

# This Dockerfile is used for devcontainers, it installs the nix package manager
# and devbox to manipulate said package manager through devbox.json files
