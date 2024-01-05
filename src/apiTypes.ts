type crumbs =
  & {
    quota: number
    ad: boolean
  }
  & (
    {
      plan: 'free'
      remaining: number
    } | {
      plan: 'payg' | 'unlimited'
    }
  )

export type smsCrumbs = crumbs & {
  type: 'sms'
}
export type emailCrumbs = crumbs & {
  type: 'email'
}

export type smsResult = {
  code: number
  message: string
  crumbs: smsCrumbs
}
export type emailResult = {
  code: number
  message: string
  crumbs: emailCrumbs
}
