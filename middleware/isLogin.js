const isLogin = (req, res, next) => {
    if (!req.userId || !req.role) {


        return res.status(401).json({
            success: false,
            message: "You are not login and authorized to access this resource"
        })
    }
    next()
}

export default isLogin;