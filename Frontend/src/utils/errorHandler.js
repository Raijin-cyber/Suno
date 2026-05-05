function errorHandler (error, info) {
    let {location, errorInfo} = info;
    console.error("Error encountered: ", error, location, errorInfo);
}

export default errorHandler;