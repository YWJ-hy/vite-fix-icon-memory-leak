import type { Plugin } from 'vite'

export interface Option {
  apply?: Plugin['apply']
}
