import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Field, Label } from '@/components/ui/field'
import { Input, Textarea } from '@/components/ui/input'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { normaliseError } from '@/services/api'
import { trainingAdminApi } from '@/services/trainingAdminApi'
import { usePageMeta } from '@/lib/seo'

const TABS = [
  ['courses', 'Courses'],
  ['categories', 'Categories'],
  ['instructors', 'Instructors'],
  ['schedules', 'Schedules'],
]

function messageFrom(error) {
  const normalised = normaliseError(error)
  return Object.values(normalised.errors ?? {}).flat()[0] || normalised.message
}

function AdminField({ label, id, value, onChange, type = 'text', required = false, ...props }) {
  const Control = type === 'textarea' ? Textarea : Input
  return (
    <Field label={label} htmlFor={id} required={required}>
      <Control
        id={id}
        type={type === 'textarea' ? undefined : type}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        {...props}
      />
    </Field>
  )
}

function SelectField({ label, id, value, onChange, children, required = false }) {
  return (
    <Field label={label} htmlFor={id} required={required}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="h-11 w-full rounded-sm border border-input bg-white px-3.5 text-sm text-ink outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
      >
        {children}
      </select>
    </Field>
  )
}

function CheckField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-navy" />
      {label}
    </label>
  )
}

function CourseForm({ course, categories, instructors, onCancel, onSaved }) {
  const initial = useMemo(() => ({
    title: course?.title ?? '',
    slug: course?.slug ?? '',
    courseCategoryId: String(course?.category?.id ?? ''),
    summary: course?.summary ?? '',
    description: course?.description ?? '',
    imageAlt: course?.imageAlt ?? '',
    learningObjectives: (course?.learningObjectives ?? []).join('\n'),
    curriculum: JSON.stringify(course?.curriculum ?? [], null, 2),
    duration: course?.duration ?? '',
    deliveryMethod: course?.deliveryMethod ?? '',
    requirements: (course?.requirements ?? []).join('\n'),
    faqs: JSON.stringify(course?.faqs ?? [], null, 2),
    instructors: (course?.instructors ?? []).map((item) => String(item.id)),
    credentialName: course?.credential?.name ?? '',
    credentialIssuer: course?.credential?.issuer ?? '',
    credentialVerified: Boolean(course?.credentialVerified),
    certificateSupported: Boolean(course?.certificateSupported),
    registrationEnabled: Boolean(course?.registrationEnabled),
    featured: Boolean(course?.featured),
    status: course?.status ?? 'draft',
    seoTitle: course?.seoTitle ?? '',
    seoDescription: course?.seoDescription ?? '',
  }), [course])
  const [values, setValues] = useState(initial)
  const [image, setImage] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setValues((current) => ({ ...current, [key]: value }))
  }
  const toggleInstructor = (id) => {
    const key = String(id)
    setValues((current) => ({
      ...current,
      instructors: current.instructors.includes(key)
        ? current.instructors.filter((item) => item !== key)
        : [...current.instructors, key],
    }))
  }

  const parseArray = (raw, label) => {
    let result
    try {
      result = JSON.parse(raw || '[]')
    } catch {
      throw new Error(`${label} must be valid JSON.`)
    }
    if (!Array.isArray(result)) throw new Error(`${label} must be a JSON array.`)
    return result
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const curriculum = parseArray(values.curriculum, 'Curriculum')
      const faqs = parseArray(values.faqs, 'FAQs')
      const body = new FormData()
      const scalars = {
        title: values.title,
        slug: values.slug,
        course_category_id: values.courseCategoryId,
        summary: values.summary,
        description: values.description,
        image_alt: values.imageAlt,
        duration: values.duration,
        delivery_method: values.deliveryMethod,
        credential_name: values.credentialName,
        credential_issuer: values.credentialIssuer,
        credential_verified: values.credentialVerified ? '1' : '0',
        certificate_supported: values.certificateSupported ? '1' : '0',
        registration_enabled: values.registrationEnabled ? '1' : '0',
        featured: values.featured ? '1' : '0',
        status: values.status,
        seo_title: values.seoTitle,
        seo_description: values.seoDescription,
        remove_image: removeImage ? '1' : '0',
      }
      Object.entries(scalars).forEach(([key, value]) => body.append(key, value))
      values.learningObjectives.split('\n').map((item) => item.trim()).filter(Boolean)
        .forEach((item, index) => body.append(`learning_objectives[${index}]`, item))
      values.requirements.split('\n').map((item) => item.trim()).filter(Boolean)
        .forEach((item, index) => body.append(`requirements[${index}]`, item))
      values.instructors.forEach((id, index) => body.append(`instructors[${index}]`, id))
      curriculum.forEach((item, index) => {
        body.append(`curriculum[${index}][title]`, item.title ?? '')
        body.append(`curriculum[${index}][description]`, item.description ?? '')
      })
      faqs.forEach((item, index) => {
        body.append(`faqs[${index}][question]`, item.question ?? '')
        body.append(`faqs[${index}][answer]`, item.answer ?? '')
      })
      if (image) body.append('image', image)
      await trainingAdminApi.saveCourse(body, course?.id)
      await onSaved()
    } catch (saveError) {
      setError(messageFrom(saveError))
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-line bg-white p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-navy">{course ? 'Edit course' : 'Create course'}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Close</Button>
      </div>
      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
      {categories.length === 0 && <p role="alert" className="text-sm text-danger">Create a category before adding a course.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Course title" id="course-title" value={values.title} onChange={update('title')} required />
        <AdminField label="URL slug" id="course-slug" value={values.slug} onChange={update('slug')} required />
        <SelectField label="Category" id="course-category" value={values.courseCategoryId} onChange={update('courseCategoryId')} required>
          <option value="">Select category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </SelectField>
        <AdminField label="Duration" id="course-duration" value={values.duration} onChange={update('duration')} placeholder="Only enter a verified duration" />
        <AdminField label="Delivery method" id="course-delivery" value={values.deliveryMethod} onChange={update('deliveryMethod')} />
        <SelectField label="Publication status" id="course-status" value={values.status} onChange={update('status')}>
          <option value="draft">Draft</option><option value="published">Published</option>
        </SelectField>
      </div>
      <AdminField label="Summary" id="course-summary" type="textarea" rows={3} value={values.summary} onChange={update('summary')} required />
      <AdminField label="Detailed description" id="course-description" type="textarea" rows={5} value={values.description} onChange={update('description')} required />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Learning objectives (one per line)" id="course-objectives" type="textarea" rows={5} value={values.learningObjectives} onChange={update('learningObjectives')} />
        <AdminField label="Requirements (one per line)" id="course-requirements" type="textarea" rows={5} value={values.requirements} onChange={update('requirements')} />
        <AdminField label="Curriculum JSON array (title, description)" id="course-curriculum" type="textarea" rows={7} value={values.curriculum} onChange={update('curriculum')} />
        <AdminField label="FAQs JSON array (question, answer)" id="course-faqs" type="textarea" rows={7} value={values.faqs} onChange={update('faqs')} />
      </div>
      <div>
        <Label htmlFor="course-image">Course image</Label>
        <Input id="course-image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2" onChange={(event) => setImage(event.target.files?.[0] ?? null)} />
        {course?.image && <p className="mt-2 text-xs text-muted">An image is currently stored for this course.</p>}
        {course?.image && <CheckField label="Remove current image" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />}
        <AdminField label="Image alt text" id="course-image-alt" value={values.imageAlt} onChange={update('imageAlt')} />
      </div>
      <fieldset className="border border-line p-4">
        <legend className="px-2 text-sm font-semibold text-navy">Instructor profiles</legend>
        {instructors.length === 0 ? <p className="text-sm text-muted">No instructor profiles are available yet.</p> : (
          <div className="flex flex-wrap gap-4">
            {instructors.map((instructor) => (
              <CheckField key={instructor.id} label={`${instructor.name}${instructor.status === 'draft' ? ' (draft)' : ''}`} checked={values.instructors.includes(String(instructor.id))} onChange={() => toggleInstructor(instructor.id)} />
            ))}
          </div>
        )}
      </fieldset>
      <fieldset className="space-y-4 border border-line p-4">
        <legend className="px-2 text-sm font-semibold text-navy">Credential and publishing controls</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Credential name" id="credential-name" value={values.credentialName} onChange={update('credentialName')} />
          <AdminField label="Credential issuer" id="credential-issuer" value={values.credentialIssuer} onChange={update('credentialIssuer')} />
        </div>
        <div className="flex flex-wrap gap-5">
          <CheckField label="Credential information verified" checked={values.credentialVerified} onChange={update('credentialVerified')} />
          <CheckField label="Certificate issuing supported" checked={values.certificateSupported} onChange={update('certificateSupported')} />
          <CheckField label="Enable registration" checked={values.registrationEnabled} onChange={update('registrationEnabled')} />
          <CheckField label="Feature this course" checked={values.featured} onChange={update('featured')} />
        </div>
      </fieldset>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="SEO title" id="course-seo-title" value={values.seoTitle} onChange={update('seoTitle')} />
        <AdminField label="SEO description" id="course-seo-description" type="textarea" rows={2} value={values.seoDescription} onChange={update('seoDescription')} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending || categories.length === 0}>{pending ? 'Saving…' : 'Save course'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export function TrainingAdminPage() {
  const client = useQueryClient()
  const [tab, setTab] = useState('courses')
  const [editingCourse, setEditingCourse] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingInstructor, setEditingInstructor] = useState(null)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [categoryValues, setCategoryValues] = useState({ name: '', slug: '', description: '', sort_order: '0' })
  const [instructorValues, setInstructorValues] = useState({
    name: '', slug: '', position: '', biography: '', professional_background: '', expertise: '', status: 'draft',
  })
  const [scheduleValues, setScheduleValues] = useState({
    label: '', starts_at: '', ends_at: '', registration_opens_at: '', registration_closes_at: '',
    delivery_method: '', location: '', max_participants: '', status: 'draft',
  })

  usePageMeta({ title: 'Training administration', noindex: true })

  const coursesQuery = useQuery({ queryKey: ['admin-training', 'courses'], queryFn: () => trainingAdminApi.courses() })
  const categoriesQuery = useQuery({ queryKey: ['admin-training', 'categories'], queryFn: trainingAdminApi.categories })
  const instructorsQuery = useQuery({ queryKey: ['admin-training', 'instructors'], queryFn: trainingAdminApi.instructors })
  const courses = useMemo(() => coursesQuery.data?.data ?? [], [coursesQuery.data])
  const categories = categoriesQuery.data ?? []
  const instructors = instructorsQuery.data ?? []

  useEffect(() => {
    if (!selectedCourseId && courses.length) setSelectedCourseId(String(courses[0].id))
  }, [courses, selectedCourseId])

  const schedulesQuery = useQuery({
    queryKey: ['admin-training', 'schedules', selectedCourseId],
    queryFn: () => trainingAdminApi.schedules(selectedCourseId),
    enabled: Boolean(selectedCourseId),
  })

  const refresh = async (area = 'all') => {
    setError('')
    setMessage('')
    const keys = area === 'all'
      ? [['admin-training', 'courses'], ['admin-training', 'categories'], ['admin-training', 'instructors'], ['admin-training', 'schedules']]
      : [['admin-training', area]]
    await Promise.all(keys.map((queryKey) => client.invalidateQueries({ queryKey })))
    setMessage('Training records saved.')
  }

  const runAction = async (action, area = 'all') => {
    setError('')
    setMessage('')
    try {
      await action()
      await refresh(area)
      return true
    } catch (actionError) {
      setError(messageFrom(actionError))
      return false
    }
  }

  const resetCategory = () => {
    setEditingCategory(null)
    setCategoryValues({ name: '', slug: '', description: '', sort_order: '0' })
  }
  const resetInstructor = () => {
    setEditingInstructor(null)
    setInstructorValues({ name: '', slug: '', position: '', biography: '', professional_background: '', expertise: '', status: 'draft' })
  }
  const resetSchedule = () => {
    setEditingSchedule(null)
    setScheduleValues({ label: '', starts_at: '', ends_at: '', registration_opens_at: '', registration_closes_at: '', delivery_method: '', location: '', max_participants: '', status: 'draft' })
  }

  const editCategory = (category) => {
    setEditingCategory(category)
    setCategoryValues({ name: category.name, slug: category.slug, description: category.description ?? '', sort_order: String(category.sortOrder ?? 0) })
  }
  const editInstructor = (instructor) => {
    setEditingInstructor(instructor)
    setInstructorValues({
      name: instructor.name, slug: instructor.slug, position: instructor.position ?? '',
      biography: instructor.biography ?? '', professional_background: instructor.professionalBackground ?? '',
      expertise: (instructor.expertise ?? []).join('\n'), status: instructor.status,
    })
  }
  const editSchedule = (schedule) => {
    setEditingSchedule(schedule)
    const localInput = (value) => {
      if (!value) return ''
      const date = new Date(value)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return date.toISOString().slice(0, 16)
    }
    setScheduleValues({
      label: schedule.label, starts_at: localInput(schedule.startsAt), ends_at: localInput(schedule.endsAt),
      registration_opens_at: localInput(schedule.registrationOpensAt),
      registration_closes_at: localInput(schedule.registrationClosesAt),
      delivery_method: schedule.deliveryMethod ?? '', location: schedule.location ?? '',
      max_participants: schedule.maxParticipants ? String(schedule.maxParticipants) : '', status: schedule.status,
    })
  }

  const saveCategory = (event) => {
    event.preventDefault()
    runAction(() => trainingAdminApi.saveCategory({
      ...categoryValues,
      sort_order: Number(categoryValues.sort_order) || 0,
    }, editingCategory?.id), 'categories').then((saved) => { if (saved) resetCategory() })
  }
  const saveInstructor = (event) => {
    event.preventDefault()
    runAction(() => trainingAdminApi.saveInstructor({
      ...instructorValues,
      expertise: instructorValues.expertise.split('\n').map((item) => item.trim()).filter(Boolean),
    }, editingInstructor?.id), 'instructors').then((saved) => { if (saved) resetInstructor() })
  }
  const saveSchedule = (event) => {
    event.preventDefault()
    if (!selectedCourseId) return
    const values = {
      ...scheduleValues,
      registration_opens_at: scheduleValues.registration_opens_at || null,
      registration_closes_at: scheduleValues.registration_closes_at || null,
      max_participants: scheduleValues.max_participants ? Number(scheduleValues.max_participants) : null,
    }
    runAction(() => trainingAdminApi.saveSchedule(selectedCourseId, values, editingSchedule?.id), 'schedules').then(resetSchedule)
  }

  const renderError = error || coursesQuery.error || categoriesQuery.error || instructorsQuery.error
  if ([coursesQuery, categoriesQuery, instructorsQuery].some((query) => query.isPending)) return <LoadingState label="Loading training records…" />
  if (coursesQuery.isError || categoriesQuery.isError || instructorsQuery.isError) {
    return <ErrorState title="Training administration data could not be loaded" text={renderError ? messageFrom(renderError) : undefined} onRetry={() => {
      coursesQuery.refetch(); categoriesQuery.refetch(); instructorsQuery.refetch()
    }} />
  }

  const tabContent = {
    courses: (
      <div className="space-y-5">
        {editingCourse !== false && (
          <CourseForm
            key={editingCourse?.id ?? 'new'}
            course={editingCourse || null}
            categories={categories}
            instructors={instructors}
            onCancel={() => setEditingCourse(false)}
            onSaved={async () => { setEditingCourse(false); await refresh('courses') }}
          />
        )}
        {editingCourse === false && <Button onClick={() => setEditingCourse(null)}>Create course</Button>}
        {courses.length === 0 ? <p className="border border-dashed border-line p-8 text-center text-sm text-muted">No courses are in the catalogue. Add a verified course when information is approved.</p> : (
          <div className="overflow-x-auto border border-line bg-white">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="bg-canvas text-xs uppercase text-muted"><tr><th className="p-3">Course</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
              <tbody className="divide-y divide-line">
                {courses.map((course) => <tr key={course.id}>
                  <td className="p-3 font-medium text-navy">{course.title}</td><td className="p-3">{course.category?.name}</td><td className="p-3 capitalize">{course.status}</td>
                  <td className="space-x-2 p-3"><Button size="sm" variant="outline" onClick={() => setEditingCourse(course)}>Edit</Button><Button size="sm" variant="ghost" onClick={() => runAction(() => trainingAdminApi.deleteCourse(course.id), 'courses')}>Delete</Button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    ),
    categories: (
      <div className="space-y-5">
        <form onSubmit={saveCategory} className="grid gap-4 border border-line bg-white p-5 md:grid-cols-2">
          <h3 className="md:col-span-2 text-lg font-semibold text-navy">{editingCategory ? 'Edit category' : 'Add category'}</h3>
          <AdminField label="Name" id="category-name" value={categoryValues.name} onChange={(event) => setCategoryValues({ ...categoryValues, name: event.target.value })} required />
          <AdminField label="Slug" id="category-slug" value={categoryValues.slug} onChange={(event) => setCategoryValues({ ...categoryValues, slug: event.target.value })} required />
          <AdminField label="Description" id="category-description" type="textarea" value={categoryValues.description} onChange={(event) => setCategoryValues({ ...categoryValues, description: event.target.value })} />
          <AdminField label="Sort order" id="category-order" type="number" value={categoryValues.sort_order} onChange={(event) => setCategoryValues({ ...categoryValues, sort_order: event.target.value })} />
          <div className="flex gap-2 md:col-span-2"><Button type="submit">{editingCategory ? 'Save category' : 'Add category'}</Button>{editingCategory && <Button type="button" variant="outline" onClick={resetCategory}>Cancel</Button>}</div>
        </form>
        <div className="divide-y divide-line border border-line bg-white">
          {categories.map((category) => <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold text-navy">{category.name}</p><p className="text-xs text-muted">{category.slug} · {category.courseCount ?? 0} courses</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => editCategory(category)}>Edit</Button><Button size="sm" variant="ghost" onClick={() => runAction(() => trainingAdminApi.deleteCategory(category.id), 'categories')}>Delete</Button></div></div>)}
        </div>
      </div>
    ),
    instructors: (
      <div className="space-y-5">
        <form onSubmit={saveInstructor} className="grid gap-4 border border-line bg-white p-5 md:grid-cols-2">
          <h3 className="md:col-span-2 text-lg font-semibold text-navy">{editingInstructor ? 'Edit instructor' : 'Add instructor profile'}</h3>
          <AdminField label="Full name" id="instructor-name" value={instructorValues.name} onChange={(event) => setInstructorValues({ ...instructorValues, name: event.target.value })} required />
          <AdminField label="Slug" id="instructor-slug" value={instructorValues.slug} onChange={(event) => setInstructorValues({ ...instructorValues, slug: event.target.value })} required />
          <AdminField label="Position" id="instructor-position" value={instructorValues.position} onChange={(event) => setInstructorValues({ ...instructorValues, position: event.target.value })} />
          <SelectField label="Status" id="instructor-status" value={instructorValues.status} onChange={(event) => setInstructorValues({ ...instructorValues, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option></SelectField>
          <AdminField label="Biography" id="instructor-biography" type="textarea" rows={4} value={instructorValues.biography} onChange={(event) => setInstructorValues({ ...instructorValues, biography: event.target.value })} />
          <AdminField label="Professional background" id="instructor-background" type="textarea" rows={4} value={instructorValues.professional_background} onChange={(event) => setInstructorValues({ ...instructorValues, professional_background: event.target.value })} />
          <AdminField label="Expertise (one per line)" id="instructor-expertise" type="textarea" rows={3} value={instructorValues.expertise} onChange={(event) => setInstructorValues({ ...instructorValues, expertise: event.target.value })} />
          <div className="flex gap-2"><Button type="submit">{editingInstructor ? 'Save profile' : 'Add instructor'}</Button>{editingInstructor && <Button type="button" variant="outline" onClick={resetInstructor}>Cancel</Button>}</div>
        </form>
        <div className="divide-y divide-line border border-line bg-white">
          {instructors.map((instructor) => <div key={instructor.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold text-navy">{instructor.name}</p><p className="text-xs text-muted">{instructor.position} · {instructor.status}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => editInstructor(instructor)}>Edit</Button><Button size="sm" variant="ghost" onClick={() => runAction(() => trainingAdminApi.deleteInstructor(instructor.id), 'instructors')}>Delete</Button></div></div>)}
        </div>
      </div>
    ),
    schedules: (
      <div className="space-y-5">
        <SelectField label="Course" id="schedule-course" value={selectedCourseId} onChange={(event) => { setSelectedCourseId(event.target.value); resetSchedule() }} required>
          <option value="">Select course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </SelectField>
        {selectedCourseId && (
          <form onSubmit={saveSchedule} className="grid gap-4 border border-line bg-white p-5 md:grid-cols-2">
            <h3 className="md:col-span-2 text-lg font-semibold text-navy">{editingSchedule ? 'Edit schedule' : 'Add schedule'}</h3>
            <AdminField label="Schedule label" id="schedule-label" value={scheduleValues.label} onChange={(event) => setScheduleValues({ ...scheduleValues, label: event.target.value })} required />
            <SelectField label="Status" id="schedule-status" value={scheduleValues.status} onChange={(event) => setScheduleValues({ ...scheduleValues, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option></SelectField>
            <AdminField label="Starts at" id="schedule-starts" type="datetime-local" value={scheduleValues.starts_at} onChange={(event) => setScheduleValues({ ...scheduleValues, starts_at: event.target.value })} required />
            <AdminField label="Ends at" id="schedule-ends" type="datetime-local" value={scheduleValues.ends_at} onChange={(event) => setScheduleValues({ ...scheduleValues, ends_at: event.target.value })} required />
            <AdminField label="Registration opens at" id="schedule-opens" type="datetime-local" value={scheduleValues.registration_opens_at} onChange={(event) => setScheduleValues({ ...scheduleValues, registration_opens_at: event.target.value })} />
            <AdminField label="Registration closes at" id="schedule-closes" type="datetime-local" value={scheduleValues.registration_closes_at} onChange={(event) => setScheduleValues({ ...scheduleValues, registration_closes_at: event.target.value })} />
            <AdminField label="Delivery method" id="schedule-method" value={scheduleValues.delivery_method} onChange={(event) => setScheduleValues({ ...scheduleValues, delivery_method: event.target.value })} />
            <AdminField label="Location" id="schedule-location" value={scheduleValues.location} onChange={(event) => setScheduleValues({ ...scheduleValues, location: event.target.value })} />
            <AdminField label="Maximum participants" id="schedule-capacity" type="number" value={scheduleValues.max_participants} onChange={(event) => setScheduleValues({ ...scheduleValues, max_participants: event.target.value })} min="1" />
            <div className="flex gap-2"><Button type="submit">{editingSchedule ? 'Save schedule' : 'Add schedule'}</Button>{editingSchedule && <Button type="button" variant="outline" onClick={resetSchedule}>Cancel</Button>}</div>
          </form>
        )}
        {schedulesQuery.isPending ? <LoadingState /> : schedulesQuery.isError ? <ErrorState title="Schedules could not be loaded" text={messageFrom(schedulesQuery.error)} onRetry={schedulesQuery.refetch} /> : (
          <div className="divide-y divide-line border border-line bg-white">
            {(schedulesQuery.data ?? []).map((schedule) => <div key={schedule.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold text-navy">{schedule.label}</p><p className="text-xs text-muted">{schedule.startsAt ? new Date(schedule.startsAt).toLocaleString() : ''} · {schedule.status}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => editSchedule(schedule)}>Edit</Button><Button size="sm" variant="ghost" onClick={() => runAction(() => trainingAdminApi.deleteSchedule(schedule.id), 'schedules')}>Delete</Button></div></div>)}
          </div>
        )}
      </div>
    ),
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Training management</h2>
        <p className="mt-1 text-sm text-muted">Publish only course, instructor, credential and schedule information that has been verified.</p>
      </div>
      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
      {message && <p role="status" className="border border-success/30 bg-success/5 p-3 text-sm text-success">{message}</p>}
      <nav className="flex flex-wrap gap-2 border-b border-line" aria-label="Training administration sections">
        {TABS.map(([key, label]) => <Button key={key} type="button" variant={tab === key ? 'primary' : 'ghost'} size="sm" onClick={() => { setTab(key); setError(''); setMessage('') }}>{label}</Button>)}
      </nav>
      {tabContent[tab]}
    </div>
  )
}
