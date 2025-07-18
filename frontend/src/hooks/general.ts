import { useCallback, useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function isPlainObject<T>(value: T) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

type SetStateAction<T> = T | ((prevState: T) => Partial<T>)

export function useObjectState<T extends Record<string, unknown>>(
  initialValue: T,
): [T, (arg: SetStateAction<T>) => void] {
  const [state, setState] = useState<T>(initialValue)

  const handleUpdate = useCallback((arg: SetStateAction<T>) => {
    if (typeof arg === 'function') {
      setState((s) => {
        const updaterResult = (arg as (prevState: T) => Partial<T>)(s)

        if (isPlainObject(updaterResult)) {
          return {
            ...s,
            ...updaterResult,
          }
        }
        return s
      })
    } else if (isPlainObject(arg)) {
      setState((s) => ({
        ...s,
        ...arg,
      }))
    }
  }, [])

  return [state, handleUpdate]
}
