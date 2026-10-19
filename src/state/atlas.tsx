/* eslint-disable react-refresh/only-export-components -- re-exports keep the existing '../state/atlas' imports working */
import { useMemo, useReducer, type ReactNode } from 'react'
import { AtlasContext } from './atlasContext'
import { atlasReducer, deriveView, initialAtlasState } from './atlasModel'

export * from './atlasModel'
export { useAtlas, type AtlasContextValue } from './atlasContext'

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(atlasReducer, initialAtlasState)
  const value = useMemo(() => ({ state, view: deriveView(state), dispatch }), [state])
  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>
}
