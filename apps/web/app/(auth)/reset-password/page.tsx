'use client'

import React, { Suspense } from 'react'
import ResetPassword from '../../components/reset-password/reset-password'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    }>
      <ResetPassword />
    </Suspense>
  )
}
