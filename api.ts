import parsePhoneNumber from 'libphonenumber-js'
const formatNumber = (input: string) => parsePhoneNumber(input)?.number

// TODO: Clarify the type of the API response
type sendResponse = {
  code: number
  message: string
  crumbs: {
    plan: 'free' | 'payg' | 'unlimited' 
    quota: number
    type: 'sms'
    ad: boolean
  }
}

export async function sendSMS(number: string, message: string, key: string) {
  const recipient = formatNumber(number)
  if (!recipient) throw new Error('Invalid phone number')

  const response = await fetch('https://contiguity.co/api/send/sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': key,
    },
    body: JSON.stringify({
      recipient,
      message,
    }),
  })
  const responseData = await response.json() as sendResponse

  if (!(200 <= responseData.code && responseData.code <= 299)) {
    throw new Error(responseData.message)
  }

  return responseData.crumbs
}