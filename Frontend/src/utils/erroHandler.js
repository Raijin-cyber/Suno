const erroHandler = (error, info) => {
    let { location, params, pattern, errorInfo } = info;
    console.error(error, location, errorInfo);    
}

export default erroHandler;