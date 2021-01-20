import AsyncStorage from "@react-native-community/async-storage"

export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

let timer;

export const authenticate = (token, userId, expirationTime) => {
    return dispatch => {
        dispatch(setLogOutTimer(expirationTime))
        dispatch({ type: AUTHENTICATE, token: token, userId: userId })
    }

}

export const logOut = () => {
    clearLogOutTimer()
    AsyncStorage.removeItem('userData')
    return { type: LOGOUT }
}

export const signUp = (email, password) => {
    try {
        return async dispatch => {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyACUF2qi9efnr90wA2yGcgNrfpgI8DM51s', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.error.message

                if (errorMessage === 'EMAIL_EXISTS') {
                    throw new Error('An account with this email already exists.')
                }
                if (errorMessage == 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                    throw new Error('Too many attempts at signing up. Try again later.')
                }
            }

            const data = await response.json()
            const expirationDate = new Date(new Date().getTime() + parseInt(data.expiresIn) * 1000)

            dispatch(authenticate(data.idToken, data.localId, data.expiresIn * 1000))

            AsyncStorage.setItem('userData', JSON.stringify({
                userId: data.localId,
                token: data.idToken,
                expirationDate: expirationDate.toISOString()
            }))
        }
    } catch (err) {
        throw err
    }
}

export const login = (email, password) => {
    try {
        return async dispatch => {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyACUF2qi9efnr90wA2yGcgNrfpgI8DM51s', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.error.message

                if (errorMessage === 'EMAIL_NOT_FOUND') {
                    throw new Error('An account with this email does not exist.')
                }
                if (errorMessage === 'INVALID_PASSWORD') {
                    throw new Error('Incorrect Password.')
                }
                if (errorMessage === 'USER_DISABLED') {
                    throw new Error('This user has been banned.')
                }

                throw new Error('Something went wrong')
            }

            const data = await response.json()
            const expirationDate = new Date(new Date().getTime() + parseInt(data.expiresIn) * 1000)

            dispatch(authenticate(data.idToken, data.localId, data.expiresIn * 1000))

            AsyncStorage.setItem('userData', JSON.stringify({
                userId: data.localId,
                token: data.idToken,
                expirationDate: expirationDate.toISOString()
            }))
        }
    } catch (err) {
        throw err
    }
}

const clearLogOutTimer = () => {
    if (timer) {
        clearTimeout(timer)
    }
}

const setLogOutTimer = (expirationTime) => {
    return dispatch => {
        timer = setTimeout(() => dispatch(logOut()), expirationTime)
    }
}