"""Sphinx configuration for the VGP Python backend API reference.

Build with:
    uv run sphinx-build -b html docs/backend docs/_build/api/backend
"""

import os
import sys

# Make the repo root importable so autodoc can find the `backend` package.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

project = "Visual Graph Programming — Python Backend"
author = "ACFHarbinger"
copyright = "2026, ACFHarbinger"

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.napoleon",          # Google-style docstrings (project standard)
    "sphinx.ext.viewcode",
    "sphinx.ext.intersphinx",
    "sphinx_autodoc_typehints",
    "myst_parser",                  # allow Markdown pages alongside reST
]

autosummary_generate = True
autodoc_default_options = {
    "members": True,
    "undoc-members": True,
    "show-inheritance": True,
}
autodoc_typehints = "description"
napoleon_google_docstring = True
napoleon_numpy_docstring = False

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "networkx": ("https://networkx.org/documentation/stable/", None),
}

# The backend package is scaffolded in roadmap step A2.1; until then autodoc
# emits warnings (not errors) for missing modules so the docs always build.
suppress_warnings = ["autodoc.import_object", "autosummary.import_cycle"]

templates_path = ["_templates"]
exclude_patterns = ["_build"]

html_theme = "furo"
html_title = "VGP Python Backend"
html_theme_options = {
    "source_repository": "https://github.com/ACFHarbinger/Visual-Graph-Programming",
    "source_branch": "main",
    "source_directory": "backend/",
}
