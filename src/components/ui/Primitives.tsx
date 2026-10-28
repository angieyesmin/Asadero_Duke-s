import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Search } from 'lucide-react'

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'success'; children: ReactNode }) {
  const variants = {
    primary: 'bg-red-800 text-white hover:bg-red-900',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
    success: 'bg-emerald-700 text-white hover:bg-emerald-800',
  }
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>{children}</button>
}
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>
}
export function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-900">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{action}</div>
}
export function SearchBox({ value, onChange, placeholder = 'Buscar...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <label className="flex min-w-[200px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 focus-within:border-red-400"><Search size={17}/><input aria-label={placeholder} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/></label>
}
export function StatusBadge({ status }: { status: string }) {
  const style = status === 'Listo' || status === 'Entregado' || status === 'Pagado' || status === 'Activo' ? 'bg-emerald-100 text-emerald-800' : status === 'Pendiente' ? 'bg-red-100 text-red-800' : status === 'En preparación' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{status}</span>
}
