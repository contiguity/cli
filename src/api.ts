import parsePhoneNumber from "libphonenumber-js"
export const parseNumber = (input: string) => {
  const parsed = parsePhoneNumber(input, 'US')
  if (!(parsed && parsed.isPossible())) throw new Error(`Invalid phone number: ${input}`)
  if (!parsed.isValid()) console.warn(`Phone number may not be valid: ${parsed.country} ${parsed.formatNational()} (If it is, you may need to update)`)
  return parsed
}

// TODO: Clarify the type of the API response
type sendResponse = {
  code: number
  message: string
  crumbs: crumbs
}
export type crumbs = {
  plan: string
  quota: number
  type: string
  ad: boolean
}

export async function sendSMS(number: string, message: string, key: string, mock: boolean = key === 'mock') {
  const recipient = parseNumber(number)
  if (!recipient) throw new Error('Invalid phone number')

  if (mock) {
    console.log(`Mocking sending "${message}" to ${recipient.country} ${recipient.formatNational()}.`)
    return {
      plan: 'payg',
      quota: 1234,
      type: 'sms',
      ad: false,
    }
  }

  const response = await fetch('https://contiguity.co/api/send/sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': key,
    },
    body: JSON.stringify({
      recipient: recipient.number,
      message,
    }),
  })
  const responseData = await response.json() as sendResponse

  if (!(200 <= responseData.code && responseData.code <= 299)) {
    throw new Error(responseData.message)
  }

  return responseData.crumbs
}