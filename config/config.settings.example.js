module.exports = {

    // Database credentials
    // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'mongoUrl' : 'mongodb://mindtravel:M1ndTr4v3l@localhost:27017/mindtravel',

    // HTTP server settings
    'httpPort' : process.env.HTTP_PORT || 8080,
    'httpsPort' : process.env.HTTPS_PORT || 8443,
    
    // SSL Configuration
    'allowHttps' : false,
    'forceHttps' : false,

    // Image data repository path
    'pathAlbums' : 'private/album/',
    'pathThumbnails' : 'private/album_thumbnail/',

    // Passport settings
    'passportSecret' : 'ChangeThisDefaultPassportSecretKey'
};
