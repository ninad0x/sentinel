"use client"

import PhoneEmailPopup from '@/components/phoneEmailPopup'
import React from 'react'

export default function PhoneDemo() {
  return (
    <div className="h-screen w-full flex justify-center items-center mx-auto">
      <div className="w-xl">
        <PhoneEmailPopup />
      </div>
    </div>
  )
}
