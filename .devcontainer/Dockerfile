# Dev Container image: C++20 toolchain (via pixi), Python 3.12 (via uv),
# Node 20+, Rust, and the native Tauri/webview dependencies needed to build
# every VGP module (base/, backend/, extension/, app/) from one container.
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ENV DEBIAN_FRONTEND=noninteractive \
    PIXI_HOME=/opt/pixi \
    CARGO_HOME=/opt/cargo \
    RUSTUP_HOME=/opt/rustup \
    UV_INSTALL_DIR=/opt/uv

# Tauri/webview + build deps (see README.md "Linux system packages")
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    file \
    git \
    unzip \
    libssl-dev \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# pixi manages the C++ toolchain (CMake, Ninja, Tree-sitter, test frameworks)
# for base/ — see pixi.toml
RUN curl -fsSL https://pixi.sh/install.sh | PIXI_HOME=${PIXI_HOME} bash
ENV PATH="${PIXI_HOME}/bin:${PATH}"

# uv manages the Python 3.12 backend/ environment — see pyproject.toml
RUN curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR=${UV_INSTALL_DIR} sh
ENV PATH="${UV_INSTALL_DIR}:${PATH}"

# rustup manages the Rust toolchain for app/src-tauri (Cargo workspace)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
    sh -s -- -y --default-toolchain stable --no-modify-path
ENV PATH="${CARGO_HOME}/bin:${PATH}"

# Node 20+ for the npm workspaces (extension/, app/)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

RUN chown -R vscode:vscode ${PIXI_HOME} ${CARGO_HOME} ${RUSTUP_HOME} ${UV_INSTALL_DIR}
USER vscode
WORKDIR /workspaces/Visual-Graph-Programming

CMD ["/bin/bash"]
