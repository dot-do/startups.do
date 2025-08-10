import * as React from 'react'

export function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className='mx-auto max-w-prose pt-16 pb-8 text-center'>
      <h1 className='text-3xl font-medium'>{title}</h1>
      <p className='mt-3 text-balance text-muted-foreground'>{subtitle}</p>
    </section>
  )
}

export default Hero
