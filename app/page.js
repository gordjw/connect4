import Image from 'next/image'
import styles from './page.module.css'

import GridController from '@/components/grid-controller'

export default function Home() {
  return (
    <>
      <h1>Connect 4</h1>

      <GridController />
    </>
  )
}
