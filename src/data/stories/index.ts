import type { ChapterContent, ChapterId } from '../../types'
import shtetls from './shtetls'
import pale from './pale'
import faithIdeas from './faith-ideas'
import atlantic from './atlantic'
import lowerEastSide from './lower-east-side'
import americanCulture from './american-culture'
import destruction from './destruction'

export const chapterContent: Record<ChapterId, ChapterContent> = {
  shtetls,
  pale,
  'faith-ideas': faithIdeas,
  atlantic,
  'lower-east-side': lowerEastSide,
  'american-culture': americanCulture,
  destruction,
}
