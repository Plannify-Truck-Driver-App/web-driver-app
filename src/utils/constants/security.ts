export const PASSWORD_SECURITY = {
    MIN_LENGTH: {
        VALUE: 12,
        ERROR: "au moins 12 caractères"
    },
    MIN_LOWERCASE: {
        VALUE: 1,
        ERROR: "au moins une lettre minuscule"
    },
    MIN_UPPERCASE: {
        VALUE: 1,
        ERROR: "au moins une lettre majuscule"
    },
    MIN_NUMBER: {
        VALUE: 1,
        ERROR: "au moins un chiffre"
    },
    MIN_SPECIAL: {
        VALUE: 1,
        ERROR: "au moins un caractère spécial"
    },
    REGEX_LOWERCASE: /[a-z]/,
    REGEX_UPPERCASE: /[A-Z]/,
    REGEX_NUMBER: /\d/,
    REGEX_SPECIAL: /[^a-zA-Z0-9]/
}