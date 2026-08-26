---
layout: archive
title: "Software, Codes, & Systems"
permalink: /software/
author_profile: true
---

<style>
  .hb-head {
    display: block;
    margin-bottom: 0.15em;
    line-height: 1.5; }

  /* Track badges */
  .hb-track {
    display: inline-block;
    margin-left: 0.45em;
    padding: 0.12em 0.55em;
    border-radius: 3px;
    font-size: 0.68em;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    vertical-align: 0.12em;
    white-space: nowrap; }

  .hb-research {
    color: #4338ca;
    background: #eef2ff;
    border: 1px solid rgba(67, 56, 202, 0.22); }

  .hb-engineering {
    color: #0f766e;
    background: #f0fdfa;
    border: 1px solid rgba(15, 118, 110, 0.22); }


  .hb-status {
    display: inline-block;
    margin-left: 0.4em;
    padding: 0.12em 0.5em;
    border-radius: 3px;
    font-size: 0.68em;
    font-weight: 500;
    color: #64748b;
    background: #f1f5f9;
    vertical-align: 0.12em;
    white-space: nowrap; }

  .hb-meta {
    display: block;
    margin-top: 0.3em;
    font-size: 0.82em;
    line-height: 1.65;
    color: #64748b; }
    .hb-meta a {
      color: #64748b;
      text-decoration: none;
      border-bottom: 1px solid rgba(100, 116, 139, 0.35); }
      .hb-meta a:hover {
        color: #4338ca;
        border-bottom-color: #4338ca; }
    .hb-meta strong {
      color: #334155; }


  .hb-highlights {
    margin: 1.2em 0 0.4em;
    padding: 1.1em 1.3em 0.6em;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #4338ca;
    border-radius: 4px;
    background: #fbfcfe; }
    .hb-highlights p {
      margin-bottom: 0.85em; }
    .hb-highlights p:last-child {
      margin-bottom: 0.35em; }


  .page__content h2 + p {
    margin-top: 0.6em; }

  @media (max-width: 600px) {
    .hb-track,
    .hb-status {
      margin-left: 0.3em;
      font-size: 0.64em; }
    .hb-highlights {
      padding: 0.9em 1em 0.5em; } }

  .hb-early {
    margin: 1.4em 0 0.2em;
    padding: 0.75em 0 0.2em 0.95em;
    border-left: 2px solid #e2e8f0;
    font-size: 0.9em;
    color: #64748b; }
    .hb-early p {
      margin-bottom: 0.4em; }
    .hb-early .hb-meta {
      margin-top: 0.25em; }
</style>


<!-- --------------------------------------------------------- -->

---

## Research Software

<font style="font-size:15px; color:#64748b;">Open-source research packages implementing published or in-progress methodology. Released first.</font>

<span class="hb-head">**[DigplexQ](https://github.com/heitorbaldo/DigplexQ)** <span class="hb-track hb-research">Research</span></span>
DigplexQ is an open-source Python package for performing computations on digraph-based complexes, including directed flag complexes and path complexes. It is designed as an adjacency-matrix-centered package, allowing users to perform all computations directly from an adjacency matrix without requiring explicit construction of the underlying complex. The package implements a range of quantitative methods for analyzing digraph-based complexes, primarily based on concepts from directed Q-analysis. At present, the implementation focuses exclusively on lower q-adjacency.
<span class="hb-meta">PyPI v0.0.7 · [GitHub](https://github.com/heitorbaldo/DigplexQ) · [Related work](/publications/) · Tools: NumPy · NetworkX · SciPy · NetworkX · Giotto-tda · Persim · hodgelaplacians.</span>
<span class="hb-meta">**DigplexQ.jl** - Julia version, in development. Docker image planned.</span>

<span class="hb-head">**[PyPDC](https://github.com/heitorbaldo/PyPDC)** <span class="hb-track hb-research">Research</span></span>
PyPDC is an open-source Python package for estimating Partial Directed Coherence (PDC) and Directed Coherence (DC) from multivariate time-series data, with a particular focus on brain connectivity analysis. It implements asymptotic PDC estimation, allowing researchers to characterize directional information flow between pairs of brain regions or recording channels in the frequency domain.
<span class="hb-meta">PyPI v0.0.8 · [GitHub](https://github.com/heitorbaldo/PyPDC) · [Related work](/publications/) · NumPy · SciPy · Matplotlib.</span>

<span class="hb-head">**[PyTropical](https://github.com/heitorbaldo/PyTropical)** <span class="hb-track hb-research">Research</span></span>
PyTropical is an open-source Python package for tropical mathematics, providing computational tools for working with tropical algebra. The package currently focuses on max-plus and min-plus algebras, implementing fundamental tropical operations such as tropical addition, multiplication, and exponentiation.
<span class="hb-meta">PyPI v0.0.2 · [GitHub](https://github.com/heitorbaldo/PyTropical) · NumPy.</span>


<span class="hb-head">**[TemporalHypermotifs](https://github.com/heitorbaldo/TemporalHypermotifs)** <span class="hb-track hb-research">Research</span></span>
Detection, classification, and quantification of temporal hypergraph motifs (THMs). Implements measures at motif level, single-layer hypergraph level, and multilayer hypergraph level.
<span class="hb-meta">[GitHub](https://github.com/heitorbaldo/TemporalHypermotifs) · NumPy · SciPy · NetworkX · HyperNetX · Numba-CUDA.</span>


<span class="hb-head">**[GeometrySpectralEvo](https://github.com/heitorbaldo/GeometrySpectralEvo)** <span class="hb-track hb-research">Research</span><span class="hb-status">In development</span></span>
Earlier-stage package - This package implements methods to treat the empirical spectral density (ESD) of a normalised graph Laplacian as a point in Wasserstein space, and a temporal graph as a curve in this space. It also implements geometric descriptors to analyze the geometry of graph spectral evolution over time.
<span class="hb-meta">[GitHub](https://github.com/heitorbaldo/GeometrySpectralEvo) · NumPy · NetworkX.</span>



---

## Notes and Notebooks

<font style="font-size:15px; color:#64748b;">Notes and exploratory codes (not packaged for reuse).</font>

<span class="hb-head">**[Notes on Topological Deep Learning](https://github.com/heitorbaldo/Notes-Topological-Deep-Learning)** <span class="hb-track hb-research">Research</span></span>
Jupyter notebooks implementing neural network models for classifying random graphs and hypergraphs based on their underlying generative models.
<span class="hb-meta">[GitHub](https://github.com/heitorbaldo/Notes-Topological-Deep-Learning) · Tools: NumPy · NetworkX · Matplotlib · PyTorch · PyTorch Geometric · scikit-learn.</span>


<span class="hb-head">**[Notes on Artificial Intelligence in Neuroimaging Analysis](https://github.com/heitorbaldo/Notes-Artificial-Intelligence-Neuroimaging)** <span class="hb-track hb-research">Research</span></span>
A collection of Jupyter notebooks providing algorithms and deep learning models for the analysis of fMRI, EEG, and MEG data.
<span class="hb-meta">[GitHub](https://github.com/heitorbaldo/Notes-Artificial-Intelligence-Neuroimaging) · Tools: NumPy · Matplotlib · Seaborn · PyTorch · scikit-learn · Nilearn · NiBabel.</span>

