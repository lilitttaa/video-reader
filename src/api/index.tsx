export const getBackendUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return process.env.REACT_APP_API_BASE_URL_DEV
    }
    return process.env.REACT_APP_API_BASE_URL_PROD
}