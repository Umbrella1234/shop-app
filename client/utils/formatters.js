// fix me

const formatInteger = int => int.toLocaleString().replace(',', ' ')

export function formatPrice (num) {
  const integerName = 'р.'
  const decimalName = 'коп.'

  const isInteger = Number.isInteger(num)

  if (isInteger) {
    if (num < 10000) {
      return `${num} ${integerName}`
    } else {
      return `${formatInteger(num)} ${integerName}`
    }
  }

  const [integer, decimal] = num.toFixed(2).split('.')
  const integerPart = formatInteger(integer)

  return `${integerPart} ${integerName} ${decimal} ${decimalName}`
}
