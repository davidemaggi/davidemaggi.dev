import hodor from './hodor'
import queueCumber from './queuecumber'
import type { OpenSourceProject } from './types'

/**
 * Projects shown in the App Store, in display order.
 * To add one: create `<id>.ts` next to this file, drop its icon in `public/projects/<id>/` and list it here.
 */
export const OPEN_SOURCE_PROJECTS: readonly OpenSourceProject[] = [hodor, queueCumber]

export const getProjectById = (id: string) => OPEN_SOURCE_PROJECTS.find((project) => project.id === id) ?? null
