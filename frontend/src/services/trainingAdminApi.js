import { api } from './api'

async function getData(request) {
  const { data } = await request
  return data
}

export const trainingAdminApi = {
  courses: (params = {}) => getData(api.get('/admin/training/courses', { params })),
  saveCourse: (values, id) => {
    const body = values
    if (id) body.set('_method', 'PUT')
    return getData(api.post(id ? `/admin/training/courses/${id}` : '/admin/training/courses', body))
  },
  deleteCourse: (id) => getData(api.delete(`/admin/training/courses/${id}`)),
  categories: () => getData(api.get('/admin/training/categories')),
  saveCategory: (values, id) => getData(id
    ? api.put(`/admin/training/categories/${id}`, values)
    : api.post('/admin/training/categories', values)),
  deleteCategory: (id) => getData(api.delete(`/admin/training/categories/${id}`)),
  instructors: () => getData(api.get('/admin/training/instructors')),
  saveInstructor: (values, id) => getData(id
    ? api.put(`/admin/training/instructors/${id}`, values)
    : api.post('/admin/training/instructors', values)),
  deleteInstructor: (id) => getData(api.delete(`/admin/training/instructors/${id}`)),
  schedules: (courseId) => getData(api.get(`/admin/training/courses/${courseId}/schedules`)),
  saveSchedule: (courseId, values, id) => getData(id
    ? api.put(`/admin/training/schedules/${id}`, values)
    : api.post(`/admin/training/courses/${courseId}/schedules`, values)),
  deleteSchedule: (id) => getData(api.delete(`/admin/training/schedules/${id}`)),
  registrations: (params = {}) => getData(api.get('/admin/training/registrations', { params })),
  updateRegistration: (id, status) => getData(api.put(`/admin/training/registrations/${id}`, { status })),
  recordAttendance: (id, status) => getData(api.put(`/admin/training/registrations/${id}/attendance`, { status })),
  certificates: (params = {}) => getData(api.get('/admin/training/certificates', { params })),
  issueCertificate: (enrollmentId) => getData(api.post(`/admin/training/certificates/${enrollmentId}`)),
  revokeCertificate: (certificateId) => getData(api.delete(`/admin/training/certificates/${certificateId}`)),
}
