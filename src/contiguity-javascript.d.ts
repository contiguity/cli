// deno-lint-ignore-file

declare class Contiguity {
  /**
   * Create a new instance of the Contiguity class.
   * @param {string} token - The authentication token.
   * @param {boolean} [debug=false] - (Optional) A flag indicating whether to enable debug mode.
   */
  constructor(token: string, debug?: boolean)
  token: string
  debug: boolean
  baseURL: string
  orwellBaseURL: string
  processRequestCode(code: any): number
  template: {
    /**
     * Fetch a local template.
     * @async
     * @param {string} file - The file path of the local template.
     * @throws {Error} - Throws an error if getting contents from files is not supported in the browser.
     * @returns {Promise<string>} - A promise that resolves to the minified contents of the local template.
     */
    local: (file: string) => Promise<string>
    /**
     * Fetch an online template. Coming soon.
     * @async
     * @param {string} file_name - The file name of the online template.
     */
    online: (file_name: string) => Promise<void>
  }
  send: {
    /**
     * Send a text message.
     * @async
     * @param {object} object - The object containing the message details.
     * @param {string} object.recipient - The recipient's phone number.
     * @param {string} object.message - The message to send.
     * @returns {Promise<object>} Returns the response object.
     * @throws {Error} Throws an error if required fields are missing or sending the message fails.
     */
    text: (object: { recipient: string; message: string }) => Promise<object>
    /**
     * Send an email.
     * @async
     * @param {object} object - The object containing the email details.
     * @param {string} object.recipient - The recipient's email address.
     * @param {string} object.from - The sender's name. The email address is selected automatically. Configure at contiguity.co/dashboard
     * @param {string} object.subject - The email subject.
     * @param {string} object.text - The plain text email body. Provide one body, or HTML will be prioritized if both are present.
     * @param {string} object.html - The HTML email body. Provide one body.
     * @param {string} [object.replyTo] - (Optional) The reply-to email address.
     * @param {string} [object.cc] - (Optional) The CC email addresses.
     * @returns {Promise<object>} Returns the response object.
     * @throws {Error} Throws an error if required fields are missing or sending the email fails.
     */
    email: (object: {
      recipient: string
      from: string
      subject: string
      text: string
      html: string
      replyTo?: string
      cc?: string
    }) => Promise<object>
  }
  verify: {
    /**
     * Verify a phone number's formatting.
     * @param {string} number - The phone number to verify.
     * @returns {boolean} - Returns true if the number is formatted correctly, false otherwise.
     */
    number: (number: string) => boolean
    /**
     * Verify the formatting of an email address.
     * @param {string} email - The email address to verify.
     * @returns {boolean} - Returns true if the email address is valid, false otherwise.
     */
    email: (email: string) => boolean
  }
  email_analytics: {
    /**
     * Get the delivery status of an email.
     * @async
     * @param {string} id - The email ID (returned when an email is sent).
     * @returns {Promise<object>} Returns the response object containing the delivery status.
     * @throws {Error} Throws an error if email ID is missing or the email ID is not found.
     */
    retrieve: (id: string) => Promise<object>
  }
  quota: {
    /**
     * Get quota information.
     * @async
     * @returns {Promise<object>} Returns the response object containing the quota information.
     * @throws {Error} Throws an error if the token/API key is not provided or if there is an issue retrieving the quota.
     */
    retrieve: () => Promise<object>
  }
  otp: {
    /**
     * Sends an OTP to the specified recipient.
     * @async
     * @param {object} object - The object containing the OTP details.
     * @param {string} object.recipient - The recipient's phone number to send the OTP.
     * @param {string} object.language - The language to use for the OTP message.
     * @param {string} [object.name] - (Optional) specify who the OTP is for (e.g "Your [Contiguity] code is: 123456")
     * @returns {Promise<string>} Returns the OTP ID.
     * @throws {Error} Throws an error if the token, recipient, or language is not provided, or if there is an issue sending the OTP.
     */
    send: (object: {
      recipient: string
      language: string
      name?: string
    }) => Promise<string>
    /**
     * Verifies the provided OTP.
     * @async
     * @param {object} object - The object containing the OTP verification details.
     * @param {string} object.otp_id - The OTP ID to verify.
     * @param {string} object.otp - The OTP (user input) to verify.
     * @returns {Promise<boolean>} Returns the verification status (true or false).
     * @throws {Error} Throws an error if the token, OTP ID, OTP, is not provided or if there is an issue verifying the OTP.
     */
    verify: (object: { otp_id: string; otp: string }) => Promise<boolean>
  }
  identity: {}
}
declare class Mock {
  constructor(token: any)
  token: any
  send: never
}

declare module '@contiguity/javascript' {
  /**
   * Login to Contiguity using your token.
   * @param {string} token - The authentication token.
   * @param {boolean} [debug=false] - (Optional) A flag indicating whether to enable debug mode.
   * @throws {Error} - Throws an error if the token is empty.
   * @returns {Contiguity} - Returns an instance of the Contiguity class.
   */
  export function login(token: string, debug?: boolean): Contiguity
  /**
   * Use Contiguity features in a sandbox mode, with simulated API responses.
   * @param {string} token - The authentication token (never used).
   * @returns {Mock} - Returns an instance of the Mock class.
   */
  export function mock(token: string): Contiguity // temp fix
}
