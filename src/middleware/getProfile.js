
const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models')
    try {
        const profile = await Profile.findOne({where: {id: req.get('profile_id') || 0}})
        if(!profile) return res.status(401).json({ error: `Profile does not exist!` })
        req.profile = profile
        next()
    } catch (err) {
        if(!profile) return res.status(401).json({ error: `Prodile does not exist!` })
        next(err)
    }
}
module.exports = {getProfile}