import { Pencil, Plus, Search, Shield, Trash2, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminPanel, StatusBadge } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { normaliseError } from '@/services/api'
import { usersAdminApi } from '@/services/usersAdminApi'
import { usePageMeta } from '@/lib/seo'
import { toast } from 'sonner'

function StaffEditor({ user, roles, pending, onCancel, onSave }) {
  const [values, setValues] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    isActive: user?.isActive ?? true,
    roleIds: (user?.roles ?? []).map((role) => role.id),
  })
  const [error, setError] = useState('')
  const toggleRole = (roleId) => setValues((current) => ({
    ...current,
    roleIds: current.roleIds.includes(roleId)
      ? current.roleIds.filter((id) => id !== roleId)
      : [...current.roleIds, roleId],
  }))

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        role_ids: values.roleIds,
        ...(values.password ? { password: values.password } : {}),
        ...(user ? { is_active: values.isActive } : {}),
      }
      await onSave(user?.id, payload)
    } catch (requestError) {
      const normalized = normaliseError(requestError)
      setError([normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' '))
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div><p className="eyebrow">Staff access</p><h3 className="mt-2 text-lg font-semibold text-navy">{user ? 'Edit staff member' : 'Add staff member'}</h3></div>
        <Button type="button" size="icon" variant="ghost" aria-label="Close editor" onClick={onCancel}><X className="size-4" /></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><Input required maxLength={255} value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} /></Field>
        <Field label="Email"><Input required type="email" maxLength={255} value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} /></Field>
        <Field label={user ? 'New password (optional)' : 'Temporary password'}><Input required={!user} type="password" minLength={12} autoComplete="new-password" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} /></Field>
        {user && <label className="flex items-center gap-2 self-end pb-3 text-sm text-navy"><input type="checkbox" checked={values.isActive} onChange={(event) => setValues((current) => ({ ...current, isActive: event.target.checked }))} />Account active</label>}
      </div>
      <fieldset className="space-y-3 border border-line p-4">
        <legend className="px-2 text-sm font-semibold text-navy">Roles</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {roles.map((role) => (
            <label key={role.id} className="flex items-start gap-2 border border-line p-3 text-sm">
              <input type="checkbox" checked={values.roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} />
              <span><span className="block font-medium text-navy">{role.label}</span><span className="mt-0.5 block text-xs text-muted">{role.permissions.length} permissions</span></span>
            </label>
          ))}
        </div>
        {values.roleIds.length === 0 && <p className="text-xs text-danger">Select at least one role.</p>}
      </fieldset>
      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-line pt-4"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={pending || !values.roleIds.length}>{pending ? 'Saving…' : 'Save staff account'}</Button></div>
    </form>
  )
}

function RoleManager({ roles, permissions, pending, onSave, onDelete }) {
  const [editing, setEditing] = useState(null)
  const [label, setLabel] = useState('')
  const [name, setName] = useState('')
  const [selected, setSelected] = useState([])
  const [error, setError] = useState('')
  const start = (role = null) => {
    setEditing(role)
    setLabel(role?.label ?? '')
    setName(role?.name ?? '')
    setSelected((role?.permissions ?? []).map((permission) => permission.id))
    setError('')
  }
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      await onSave(editing?.id, { name, label: label.trim(), permission_ids: selected })
      start()
    } catch (requestError) {
      const normalized = normaliseError(requestError)
      setError([normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' '))
    }
  }

  return (
    <div className="space-y-5">
      <AdminPanel title={editing ? 'Edit custom role' : 'Create custom role'} description="System roles are protected from modification.">
        <form onSubmit={submit} className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role name"><Input required disabled={Boolean(editing)} pattern="[a-z][a-z0-9_]*" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></Field>
            <Field label="Display name"><Input required maxLength={120} value={label} onChange={(event) => setLabel(event.target.value)} /></Field>
          </div>
          <fieldset className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <legend className="mb-2 text-sm font-semibold text-navy">Permissions</legend>
            {permissions.map((permission) => <label key={permission.id} className="flex items-center gap-2 border border-line p-3 text-xs text-ink"><input type="checkbox" checked={selected.includes(permission.id)} onChange={() => toggle(permission.id)} />{permission.label}</label>)}
          </fieldset>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => start()}>Clear</Button><Button type="submit" disabled={pending}>{pending ? 'Saving…' : editing ? 'Save role' : 'Create role'}</Button></div>
        </form>
      </AdminPanel>
      <AdminPanel title="Roles and permissions">
        <div className="divide-y divide-line">
          {roles.map((role) => <div key={role.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0"><p className="font-semibold text-navy">{role.label} {role.isSystem && <span className="ml-2 text-[0.625rem] font-bold uppercase text-gold-deep">System</span>}</p><p className="mt-1 text-xs text-muted">{role.userCount} staff · {role.permissions.map((permission) => permission.label).join(', ') || 'No permissions'}</p></div>
            {!role.isSystem && <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => start(role)}><Pencil className="size-3.5" />Edit</Button><Button size="icon" variant="ghost" aria-label={`Delete ${role.label}`} onClick={() => onDelete(role)}><Trash2 className="size-4 text-danger" /></Button></div>}
          </div>)}
        </div>
      </AdminPanel>
    </div>
  )
}

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="text-xs font-semibold text-navy">{label}</span>{children}</label>
}

export function UsersAdminPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('staff')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editor, setEditor] = useState(undefined)
  const [error, setError] = useState('')
  const params = { q: search || undefined, status: status || undefined, per_page: 20, page }
  const usersQuery = useQuery({ queryKey: ['admin-users', params], queryFn: async () => (await usersAdminApi.users(params)).data })
  const rolesQuery = useQuery({ queryKey: ['admin-roles'], queryFn: async () => (await usersAdminApi.roles()).data })
  const permissionsQuery = useQuery({ queryKey: ['admin-permissions'], queryFn: async () => (await usersAdminApi.permissions()).data })

  usePageMeta({ title: 'Users and roles', noindex: true })

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] }),
    ])
  }

  async function saveUser(id, values) {
    if (id) await usersAdminApi.updateUser(id, values)
    else await usersAdminApi.createUser(values)
    setEditor(undefined)
    await refresh()
    toast.success('Staff account saved.')
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return
    setError('')
    try {
      await usersAdminApi.deleteUser(user.id)
      await refresh()
      toast.success('Staff account deleted.')
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  async function saveRole(id, values) {
    if (id) await usersAdminApi.updateRole(id, values)
    else await usersAdminApi.createRole(values)
    await refresh()
    toast.success('Role saved.')
  }

  async function deleteRole(role) {
    if (!window.confirm(`Delete role “${role.label}”?`)) return
    try {
      await usersAdminApi.deleteRole(role.id)
      await refresh()
      toast.success('Role deleted.')
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  if (usersQuery.isPending || rolesQuery.isPending || permissionsQuery.isPending) return <LoadingState label="Loading users and roles…" />
  const failedQuery = [usersQuery, rolesQuery, permissionsQuery].find((item) => item.isError)
  if (failedQuery) return <ErrorState title="Users and roles could not be loaded" text={normaliseError(failedQuery.error).message} onRetry={() => { usersQuery.refetch(); rolesQuery.refetch(); permissionsQuery.refetch() }} />

  const users = usersQuery.data?.data ?? []
  const roles = rolesQuery.data ?? []
  const permissions = permissionsQuery.data ?? []

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-semibold text-navy">Users and roles</h2><p className="mt-1 text-sm text-muted">Manage staff accounts and their server-enforced permissions.</p></div>
      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
      <div className="flex border-b border-line" role="tablist" aria-label="User administration views">
        { [['staff', 'Staff accounts', UserRound], ['roles', 'Roles and permissions', Shield]].map(([key, label, Icon]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${tab === key ? 'border-gold text-navy' : 'border-transparent text-muted'}`}><Icon className="size-4" aria-hidden="true" />{label}</button>
        ))}
      </div>

      {tab === 'staff' && (
        <div className="space-y-5">
          <div className="flex justify-end"><Button onClick={() => setEditor(null)}><Plus className="size-4" aria-hidden="true" />Add staff</Button></div>
          {editor !== undefined && <StaffEditor key={editor?.id ?? 'new'} user={editor} roles={roles} onCancel={() => setEditor(undefined)} onSave={saveUser} />}
          <AdminPanel>
            <div className="flex flex-wrap gap-3 border-b border-line p-4">
              <label className="relative min-w-56 flex-1 sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" /><Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search name or email" aria-label="Search staff" className="pl-9" /></label>
              <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} aria-label="Filter by account status" className="h-10 border border-line bg-white px-3 text-sm"><option value="">All accounts</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            </div>
            {users.length === 0 ? <p className="p-12 text-center text-sm text-muted">No staff accounts match these filters.</p> : (
              <div className="overflow-x-auto"><table className="w-full min-w-[54rem] text-left text-sm"><thead className="bg-canvas text-xs uppercase text-muted"><tr><th className="p-3">Staff member</th><th className="p-3">Roles</th><th className="p-3">Status</th><th className="p-3">Created</th><th className="p-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-line">{users.map((user) => <tr key={user.id}><td className="p-3"><p className="font-semibold text-navy">{user.name}</p><p className="mt-1 text-xs text-muted">{user.email}</p></td><td className="p-3 text-xs text-ink">{user.roles.map((role) => role.label).join(', ') || 'No roles'}</td><td className="p-3"><StatusBadge status={user.isActive ? 'published' : 'closed'} label={user.isActive ? 'Active' : 'Inactive'} /></td><td className="p-3 text-xs text-muted">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td><td className="p-3"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => setEditor(user)}><Pencil className="size-3.5" />Edit</Button><Button size="icon" variant="ghost" aria-label={`Delete ${user.name}`} onClick={() => deleteUser(user)}><Trash2 className="size-4 text-danger" /></Button></div></td></tr>)}</tbody></table></div>
            )}
            <div className="border-t border-line px-4 py-3"><Pagination page={usersQuery.data.current_page} pageCount={usersQuery.data.last_page} onChange={setPage} /></div>
          </AdminPanel>
        </div>
      )}

      {tab === 'roles' && <RoleManager roles={roles} permissions={permissions} onSave={saveRole} onDelete={deleteRole} />}
    </div>
  )
}