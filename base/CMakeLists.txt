cmake_minimum_required(VERSION 3.24)

project(
  vgp_base
  VERSION 0.1.0
  DESCRIPTION "Visual Graph Programming core: incremental parsing and code property graph engine"
  LANGUAGES C CXX
)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

option(VGP_BUILD_TESTS "Build the GoogleTest suite" ON)
option(VGP_BUILD_SHARED "Build vgp_base as a shared library (stable C API for host wrappers)" ON)
option(VGP_ENABLE_WARNINGS_AS_ERRORS "Treat compiler warnings as errors" OFF)

include(FetchContent)

# --- Dependencies -----------------------------------------------------------
# Prefer packages provided by the pixi environment (conda-forge); fall back to
# FetchContent so a bare CMake configure still works.

find_package(PkgConfig QUIET)
#find_package(tree-sitter CONFIG REQUIRED)
#find_package(nlohmann_json CONFIG REQUIRED)
#find_package(spdlog CONFIG REQUIRED)
#find_package(IXWebSocket CONFIG REQUIRED)
#find_package(GTest CONFIG REQUIRED)
find_package(ZLIB REQUIRED)

# Tree-sitter runtime (incremental parsing)
if(PkgConfig_FOUND)
  pkg_check_modules(TREE_SITTER IMPORTED_TARGET tree-sitter)
endif()
if(NOT TREE_SITTER_FOUND)
  FetchContent_Declare(
    tree-sitter
    GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter.git
    GIT_TAG v0.25.6
    SOURCE_SUBDIR lib
  )
  FetchContent_MakeAvailable(tree-sitter)
endif()

# Tree-sitter language grammars for the initial target languages
FetchContent_Declare(
  tree-sitter-cpp
  GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter-cpp.git
  GIT_TAG v0.23.4
)
FetchContent_Declare(
  tree-sitter-python
  GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter-python.git
  GIT_TAG v0.23.6
)
FetchContent_Declare(
  tree-sitter-typescript
  GIT_REPOSITORY https://github.com/tree-sitter/tree-sitter-typescript.git
  GIT_TAG v0.23.2
)

# JSON serialization (IPC payloads, graph exports)
find_package(nlohmann_json 3.11 QUIET)
if(NOT nlohmann_json_FOUND)
  FetchContent_Declare(
    nlohmann_json
    URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
  )
  FetchContent_MakeAvailable(nlohmann_json)
endif()

# Logging
find_package(spdlog 1.13 QUIET)
if(NOT spdlog_FOUND)
  FetchContent_Declare(
    spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG v1.14.1
  )
  FetchContent_MakeAvailable(spdlog)
endif()

# WebSocket/IPC server for streaming graph updates to frontends
FetchContent_Declare(
  ixwebsocket
  GIT_REPOSITORY https://github.com/machinezone/IXWebSocket.git
  GIT_TAG v11.4.5
)
set(USE_TLS OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(ixwebsocket)

# GrafeoDB embedded graph + vector database (Rust core, C/C++ bindings).
# Ships prebuilt as libgrafeo; located via GRAFEO_ROOT or system paths.
find_library(GRAFEO_LIB NAMES grafeo grafeo_c HINTS ${GRAFEO_ROOT}/lib)
find_path(GRAFEO_INCLUDE_DIR NAMES grafeo.h grafeo/grafeo.h HINTS ${GRAFEO_ROOT}/include)
if(GRAFEO_LIB AND GRAFEO_INCLUDE_DIR)
  message(STATUS "GrafeoDB found: ${GRAFEO_LIB}")
  set(VGP_HAVE_GRAFEO ON)
else()
  message(STATUS "GrafeoDB not found — graph persistence layer disabled (set -DGRAFEO_ROOT=<path>)")
  set(VGP_HAVE_GRAFEO OFF)
endif()

# Clang / LLVM (semantic C++ analysis)
option(VGP_ENABLE_CLANG "Enable Clang semantic parser" ON)
if(VGP_ENABLE_CLANG)

    find_package(LLVM CONFIG QUIET)
    find_package(Clang CONFIG QUIET)

    if(LLVM_FOUND AND Clang_FOUND)

        message(STATUS "LLVM found: ${LLVM_PACKAGE_VERSION}")
        message(STATUS "Clang support enabled")

        set(VGP_HAVE_CLANG ON)

        include_directories(SYSTEM
            ${LLVM_INCLUDE_DIRS}
            ${CLANG_INCLUDE_DIRS}
        )

        add_definitions(${LLVM_DEFINITIONS})

    else()

        message(STATUS "LLVM/Clang not found - semantic parser disabled")
        set(VGP_HAVE_CLANG OFF)

    endif()

endif()


# --- Library targets --------------------------------------------------------

file(GLOB_RECURSE VGP_SOURCES CONFIGURE_DEPENDS src/*.cpp src/*.c)
if(VGP_HAVE_CLANG)

    target_compile_definitions(vgp_base
        PRIVATE
            VGP_HAVE_CLANG=1
    )

    target_link_libraries(vgp_base PRIVATE clangTooling clangFrontend clangSerialization clangDriver clangParse clangSema clangAnalysis clangAST clangASTMatchers clangEdit clangLex clangBasic 
    )

endif()
if(VGP_SOURCES)
  ###FetchContent_MakeAvailable(tree-sitter-cpp tree-sitter-python tree-sitter-typescript)
  ###
  ###if(VGP_BUILD_SHARED)
  ###  add_library(vgp_base SHARED ${VGP_SOURCES})
  ###else()
  ###  add_library(vgp_base STATIC ${VGP_SOURCES})
  ###endif()
  ###
  ###target_include_directories(vgp_base PUBLIC
  ###  $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
  ###  $<INSTALL_INTERFACE:include>
  ###)
  ###
  ###if(TREE_SITTER_FOUND)
  ###  target_link_libraries(vgp_base PUBLIC PkgConfig::TREE_SITTER)
  ###else()
  ###  target_link_libraries(vgp_base PUBLIC tree-sitter)
  ###endif()

  # Tree-sitter runtime (vendored as a git submodule)
  add_subdirectory(libs/base/tree.sitter/lib)
  target_link_libraries(vgp_base PUBLIC tree-sitter)
 # add_subdirectory(libs/tree-sitter/lib)
 # add_subdirectory(libs/tree-sitter-cpp)
 # add_subdirectory(libs/tree-sitter-python)
 # add_subdirectory(libs/tree-sitter-typescript)

  target_link_libraries(vgp_base
    PUBLIC nlohmann_json::nlohmann_json
    PRIVATE spdlog::spdlog ixwebsocket::ixwebsocket
  )

  target_link_libraries(vgp_base PUBLIC ZLIB::ZLIB
)

  if(VGP_HAVE_GRAFEO)
    target_include_directories(vgp_base PRIVATE ${GRAFEO_INCLUDE_DIR})
    target_link_libraries(vgp_base PRIVATE ${GRAFEO_LIB})
    target_compile_definitions(vgp_base PRIVATE VGP_HAVE_GRAFEO=1)
  endif()

  if(VGP_ENABLE_WARNINGS_AS_ERRORS)
    target_compile_options(vgp_base PRIVATE
      $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra -Werror>
      $<$<CXX_COMPILER_ID:MSVC>:/W4 /WX>
    )
  endif()
else()
  message(STATUS "No sources under base/src yet — dependency graph configured, library target skipped (roadmap step A1.1)")
endif()

# --- Tests ------------------------------------------------------------------

if(VGP_BUILD_TESTS)
  enable_testing()
  find_package(GTest 1.14 QUIET)
  if(NOT GTest_FOUND)
    FetchContent_Declare(
      googletest
      GIT_REPOSITORY https://github.com/google/googletest.git
      GIT_TAG v1.15.2
    )
    set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(googletest)
  endif()

  file(GLOB_RECURSE VGP_TEST_SOURCES CONFIGURE_DEPENDS test/*.cpp)
  if(VGP_TEST_SOURCES AND TARGET vgp_base)
    add_executable(vgp_base_tests ${VGP_TEST_SOURCES})
    target_link_libraries(vgp_base_tests PRIVATE vgp_base GTest::gtest_main)
    include(GoogleTest)
    gtest_discover_tests(vgp_base_tests)
  endif()
endif()
