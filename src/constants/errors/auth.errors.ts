export enum AuthErrorsEnum {
  InvalidRegisterLink = 'INVALID_REGISTER_LINK',
  OrganisationIsInactive = 'ORGANISATION_IS_INACTIVE',
  OrganisationNotFound = 'ORGANISATION_NOT_FOUND',
  PasswordDontMatch = 'PASSWORD_DONT_MATCH',
  UserAlreadyExist = 'USER_ALREADY_EXIST',
  NotAuthorized = 'NOT_AUTHORIZED',
  WrongLoginPassword = 'WRONG_LOGIN_PASSWORD',
  EmailServiceError = 'EMAIL_SERVICE_ERROR',
  OTPInvalid = 'OTP_INVALID',
  OTPExpired = 'OTP_EXPIRED',
  NoAccess = 'NO_ACCESS',
}
