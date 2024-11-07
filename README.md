# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Parameters
$certPath = "path\to\your_certificate.pfx"  # Path to your PFX certificate
$passphrase = "your_passphrase"             # Passphrase for the PFX certificate
$tenantId = "{tenant_id}"                   # Your Azure tenant ID
$clientId = "{client_id}"                   # Your Azure App ID

# Import the certificate
$password = ConvertTo-SecureString -String $passphrase -Force -AsPlainText
$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$cert.Import($certPath, $password, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)

# Extract the RSA private key
$rsa = $cert.GetRSAPrivateKey()

# Create JWT Header
$header = @{
    alg = "RS256"
    typ = "JWT"
}
$headerJson = (ConvertTo-Json $header -Compress)
$headerEncoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($headerJson)).Replace('=', '').Replace('+', '-').Replace('/', '_')

# Create JWT Payload
$currentUnixTime = [int](([DateTimeOffset]::Now).ToUnixTimeSeconds())
$expUnixTime = $currentUnixTime + 3600  # Token expiration (1 hour)
$payload = @{
    aud = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"
    iss = $clientId
    sub = $clientId
    nbf = $currentUnixTime
    exp = $expUnixTime
}
$payloadJson = (ConvertTo-Json $payload -Compress)
$payloadEncoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($payloadJson)).Replace('=', '').Replace('+', '-').Replace('/', '_')

# Create the JWT signature
$signingInput = "$headerEncoded.$payloadEncoded"
$signatureBytes = $rsa.SignData([System.Text.Encoding]::UTF8.GetBytes($signingInput), [System.Security.Cryptography.HashAlgorithmName]::SHA256, [System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
$signatureEncoded = [Convert]::ToBase64String($signatureBytes).Replace('=', '').Replace('+', '-').Replace('/', '_')

# Combine to form the final JWT
$jwt = "$signingInput.$signatureEncoded"

# Output the JWT
Write-Output $jwt
