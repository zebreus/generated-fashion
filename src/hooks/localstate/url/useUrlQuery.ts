import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useCallback, useMemo } from "react"

interface TypeMap {
  string: string
  number: number
  boolean: boolean
}

/** Use the state of a URL search parameter.
 * Works like useState, but without a default value.
 * You can use options to specify the type of the query parameter
 *
 * @param parameter The key of the URL parameter
 * @param options.array Treat multiple values as an array
 * @param options.type The type of the query parameter as a string. default = "string"
 * @param options.method Wether to push or to replace the url
 */
export function useUrlQuery<
  TypeName extends keyof TypeMap = "string",
  IsArray extends true | false = false,
  Type extends TypeMap[keyof TypeMap] = TypeMap[TypeName],
  ResultType extends Type[] | Type | undefined = IsArray extends true ? Type[] : Type | undefined
>(
  parameter: string,
  options?: {
    array?: IsArray
    type?: TypeName
    replace?: boolean
    /** Default keys are set everytime the set function is called */
    defaultKeys?: { key: string; value?: string }[]
  }
): [ResultType, Dispatch<SetStateAction<ResultType>>] {
  const router = useRouter()
  const queryValue = router.query[parameter]

  // The options with default values
  const realOptions = useMemo(
    () => ({
      array: options?.array || (false as IsArray),
      type: options?.type || ("string" as TypeName),
      replace: !!options?.replace,
      defaultKeys: options?.defaultKeys || [],
    }),
    [options?.array || false, options?.type || "string", !!options?.replace, JSON.stringify(options?.defaultKeys ?? [])]
  )

  const queryToTypedValue = useCallback(
    (queryValue: string | string[] | undefined) => {
      const convertToType = (value: string) => {
        switch (realOptions.type) {
          case "boolean":
            return !!(value && value !== "false") as unknown as Type
          case "number":
            return parseFloat(value) as unknown as Type
          case "string":
          default:
            return value as unknown as Type
        }
      }

      return (realOptions.array
        ? (typeof queryValue === "string" ? [queryValue] : queryValue || []).map(value => convertToType(value))
        : queryValue !== undefined
        ? convertToType(typeof queryValue === "string" ? queryValue : queryValue[0])
        : undefined) as unknown as ResultType
    },
    [realOptions]
  )

  const value = useMemo(
    () => queryToTypedValue(queryValue),
    [queryToTypedValue, typeof queryValue === "object" ? queryValue.join(",") : queryValue]
  )

  const setValue = useCallback(
    (nextValueInput: SetStateAction<ResultType>) => {
      const newSearchParams = new URLSearchParams(window.location.search)

      const nextValue =
        typeof nextValueInput === "function"
          ? nextValueInput(queryToTypedValue(newSearchParams.getAll(parameter)))
          : nextValueInput

      const newValue = realOptions.array
        ? (nextValue as unknown as Type[] | undefined)?.length
          ? (nextValue as unknown as Type[]).map(value => "" + value)
          : []
        : nextValue === undefined
        ? []
        : ["" + nextValue]

      const oldValue = newSearchParams.getAll(parameter)
      const moreOrChanged = oldValue.reduce((changed, value, index) => changed || value !== newValue[index], false)

      const changed = moreOrChanged || newValue.length !== oldValue.length

      if (!changed) {
        return
      }

      newSearchParams.delete(parameter)
      newValue.forEach(value => newSearchParams.append(parameter, value))

      const defaultParameters = realOptions.defaultKeys.map(({ key }) => key)

      defaultParameters.forEach(key => newSearchParams.delete(key))
      realOptions.defaultKeys
        .filter(({ value }) => typeof value !== "undefined")
        .forEach(({ key, value }) => newSearchParams.append(key, value as string))

      const searchString = newSearchParams.toString()

      router[realOptions.replace ? "replace" : "push"]?.(
        {
          pathname: window.location.pathname,
          query: searchString,
        },
        undefined,
        { shallow: true }
      )
    },
    [realOptions, queryToTypedValue, parameter]
  )

  return [value, setValue]
}
