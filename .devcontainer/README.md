# Dev Container

This Dev Container provisions the toolchains for every module built from
source in this repo except the Unreal Engine plugin: the C++20 core
(`base/`, via pixi + CMake), the Python backend (`backend/`, via uv), and
the TypeScript/Rust npm + Cargo workspaces (`extension/`, `app/`). Opening
it via VS Code's "Reopen in Container" gets you a working build/test
environment for all of those in one shot.

## Unreal Engine plugin (`plugin/`) is not supported here

The Unreal Editor and its build toolchain (UnrealBuildTool, Live Coding)
require a full Unreal Engine installation and are not practical to run
inside a container. To work on `plugin/`, you need a native Windows,
macOS, or Linux machine with Unreal Engine 5+ installed — see the roadmap's
engine-plugin track for setup details.
