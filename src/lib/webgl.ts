interface Probe {
  /** A WebGL context could be created. */
  available: boolean
  /** The context is backed by a CPU rasterizer (SwiftShader, llvmpipe, ...), not a GPU. */
  software: boolean
}

let cached: Probe | null = null

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|microsoft basic render/i

function probe(): Probe {
  if (cached) return cached
  let available = false
  let software = false
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (gl) {
      available = true
      const info = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = String(
        (info && gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) || gl.getParameter(gl.RENDERER) || '',
      )
      software = SOFTWARE_RENDERER.test(renderer)
      /* Release the probe context at once: browsers cap live contexts and evict the oldest. */
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    available = false
  }
  cached = { available, software }
  return cached
}

/** Whether this browser can create a WebGL context. Cached after the first call. */
export function hasWebGL(): boolean {
  return probe().available
}

/**
 * Whether WebGL is available but rendered on the CPU (a blocklisted GPU, a VM or remote desktop).
 * Camera flights and shader compiles can freeze the page for seconds there, so callers may prefer
 * instant camera jumps or a lighter fallback. Add `?gl=full` to the URL to opt out of this check.
 */
export function isSoftwareWebGL(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('gl') === 'full') return false
  } catch {
    /* ignore */
  }
  return probe().software
}

/** WebGL that is GPU-backed (or explicitly forced with `?gl=full`). */
export function hasFastWebGL(): boolean {
  return hasWebGL() && !isSoftwareWebGL()
}
