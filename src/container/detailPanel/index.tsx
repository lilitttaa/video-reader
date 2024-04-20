import { Typography } from '@mui/material'
import { getBackendUrl } from '../../api'
import {
  createValidationResult,
  HeaderBlock,
  ParagraphBlock,
  ValidationResult
} from '../../dataHandler'
import { useEffect, useState } from 'react'

export const DetailPanel = () => {
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null)
  const fetchRecentData = () => {
    fetch(getBackendUrl() + '/api/records/recent')
      .then(response => response.json())
      .then(data => {
        setValidationResult(createValidationResult(data))
      })
  }
  useEffect(() => {
    fetchRecentData()
  }, [])

  return (
    <main className='main flex flex-col p-10 gap-10 overflow-y-auto'>
      {validationResult &&
        validationResult.generateBlocks().map((block, index) => {
          if (block.type === 'header') {
            let headerBlock = block as HeaderBlock
            if (headerBlock.level === 1) {
              return (
                <Typography variant='h3' component='div'>
                  {(block as HeaderBlock).text}
                </Typography>
              )
            } else if (headerBlock.level === 2) {
              return (
                <Typography variant='h4' component='div'>
                  {(block as HeaderBlock).text}
                </Typography>
              )
            } else if (headerBlock.level === 3) {
              return (
                <Typography variant='h5' component='div'>
                  {(block as HeaderBlock).text}
                </Typography>
              )
            } else if (headerBlock.level === 4) {
              return (
                <Typography variant='h6' component='div'>
                  {(block as HeaderBlock).text}
                </Typography>
              )
            }
          } else {
            let paragraphBlock = block as ParagraphBlock
            if (paragraphBlock.isStrong) {
              return (
                <Typography variant='body1' component='div'>
                  <strong>{(block as ParagraphBlock).text}</strong>
                </Typography>
              )
            } else {
              return (
                <Typography variant='body1' component='div'>
                  {(block as ParagraphBlock).text}
                </Typography>
              )
            }
          }
        })}
    </main>
  )
}
