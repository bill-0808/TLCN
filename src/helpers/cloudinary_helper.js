const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'ddw86pztr',
    api_key: '489295679683823',
    api_secret: 'xlgdkFV2l97ND_uwo-IEhxwt2qA',
    secure: true
})

const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
}

module.exports = {cloudinary, options}