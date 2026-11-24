import { Component } from 'react'
import { Button } from '@/components/ui/button'

/** Top-level error boundary with a recoverable fallback. */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Replace with server-side reporting once the Laravel logging endpoint exists.
    console.error('CONSOL application error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-canvas px-6">
          <div className="max-w-md border border-line bg-white px-8 py-12 text-center">
            <p className="font-display text-4xl text-gold-deep">CONSOL</p>
            <h1 className="mt-4 text-2xl font-semibold text-navy">This page could not be displayed</h1>
            <p className="mt-3 text-[0.9375rem] text-muted">
              An unexpected error occurred. Reloading the page usually resolves it.
            </p>
            <Button className="mt-8" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
