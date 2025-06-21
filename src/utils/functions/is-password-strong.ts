import { PASSWORD_SECURITY } from "../constants/security";

export const isPasswordStrong = (password: string): boolean => {

    return password.length > PASSWORD_SECURITY.MIN_LENGTH.VALUE && PASSWORD_SECURITY.REGEX_UPPERCASE.test(password) && PASSWORD_SECURITY.REGEX_LOWERCASE.test(password) && PASSWORD_SECURITY.REGEX_NUMBER.test(password) && PASSWORD_SECURITY.REGEX_SPECIAL.test(password);
}