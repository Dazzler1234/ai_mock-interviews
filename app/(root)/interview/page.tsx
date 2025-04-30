import Agent from '@/components/ui/Agent'
import React from 'react'

const page = () => {
  return (
    <>
    <h3>Interview Generator</h3>
    <Agent userName="You" userId="user1" type="generate" />
    </>
  )
}

export default page