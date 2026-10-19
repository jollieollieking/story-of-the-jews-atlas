import { createContext, useContext, type Dispatch } from 'react'
import type { AtlasAction, AtlasState, AtlasView } from './atlasModel'

/*
 * The context lives in its own module so editing the reducer or the provider during development
 * does not recreate it (which made mounted components throw "useAtlas must be used inside <AtlasProvider>").
 */

export interface AtlasContextValue {
  state: AtlasState
  view: AtlasView
  dispatch: Dispatch<AtlasAction>
}

export const AtlasContext = createContext<AtlasContextValue | null>(null)

export function useAtlas(): AtlasContextValue {
  const ctx = useContext(AtlasContext)
  if (!ctx) throw new Error('useAtlas must be used inside <AtlasProvider>')
  return ctx
}
