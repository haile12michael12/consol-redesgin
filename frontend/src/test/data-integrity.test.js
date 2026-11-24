import { describe, expect, it } from 'vitest'
import { courses, trainingCategories } from '@/data/courses'
import { projects, projectCategories, publishedProjects } from '@/data/projects'
import { services } from '@/data/services'
import { news, events } from '@/data/news'
import { company, contact, credentials } from '@/lib/site'

describe('verified company data', () => {
  it('keeps the published contact details intact', () => {
    expect(company.legalName).toBe('Construction Solutions PLC')
    expect(company.founded).toBe(2005)
    expect(contact.email).toBe('info@constructionsolutionsplc.com')
    expect(contact.landline).toBe('+251 114 70 04 52')
    expect(contact.addressLines.join(' ')).toContain('Martereza Building')
  })

  it('only lists credential programmes published by CONSOL', () => {
    const names = credentials.map((item) => item.short)
    expect(names).toContain('PMI® ATP')
    expect(names).toContain('Autodesk® ATC')
    expect(names).toContain('Pearson VUE')
  })
})

describe('content model integrity', () => {
  it('uses unique slugs for every route collection', () => {
    expect(new Set(services.map((item) => item.slug)).size).toBe(services.length)
    expect(new Set(projects.map((item) => item.slug)).size).toBe(projects.length)
    expect(new Set(courses.map((item) => item.id)).size).toBe(courses.length)
    expect(new Set(news.map((item) => item.slug)).size).toBe(news.length)
    expect(new Set(events.map((item) => item.slug)).size).toBe(events.length)
  })

  it('assigns every project a known category', () => {
    const valid = new Set(projectCategories.map((item) => item.id))
    projects.forEach((project) => expect(valid.has(project.category)).toBe(true))
  })

  it('assigns every course a known training category', () => {
    const valid = new Set(trainingCategories.map((item) => item.id))
    courses.forEach((course) => expect(valid.has(course.category)).toBe(true))
  })

  it('marks demonstration records explicitly and keeps them out of featured slots', () => {
    const demo = projects.filter((project) => project.source === 'demo')
    expect(demo.length).toBeGreaterThan(0)
    demo.forEach((project) => {
      expect(project.featured).toBe(false)
      expect(project.slug.startsWith('demo-')).toBe(true)
    })
    expect(publishedProjects.every((project) => project.source === 'published')).toBe(true)
  })

  it('never publishes course dates, fees or instructor names', () => {
    courses.forEach((course) => {
      expect(course).not.toHaveProperty('startDate')
      expect(course).not.toHaveProperty('fee')
      expect(course).not.toHaveProperty('instructor')
      expect(course.duration).toBeGreaterThan(0)
    })
  })

  it('gives every published project a client and a summary', () => {
    publishedProjects.forEach((project) => {
      expect(project.summary.length).toBeGreaterThan(20)
      expect(project.year).toBeGreaterThanOrEqual(2005)
    })
  })
})
