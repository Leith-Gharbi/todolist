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

"Bonjour à tous,

J'espère que vous allez bien. Je voulais vous partager quelques nouvelles. Après en avoir discuté avec notre team leader, il a été décidé que toute nouvelle fonctionnalité MAPLE destinée à la Marketplace devra être validée par Jean-Pierre. Cela fait suite à des préoccupations concernant l'impact potentiel sur notre infrastructure, notamment après la proposition concernant le bouton de synchronisation des produits avec la Marketplace, qui n'a pas été bien reçue.

Ainsi, je vous invite à consulter Jean-Pierre en premier lieu pour toute nouvelle fonctionnalité.

Merci de votre compréhension."
$certPath = "path\to\your_certificate.pfx"
$password = ConvertTo-SecureString -String "your_passphrase" -Force -AsPlainText
$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$cert.Import($certPath, $password, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)
$privateKey = [System.Convert]::ToBase64String($cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12))
Write-Output $privateKey
$header = @{
    alg = "RS256"
    typ = "JWT"
}
$payload = @{
    aud = "https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    iss = "{client_id}"
    sub = "{client_id}"
    exp = [int](([DateTimeOffset]::Now.ToUnixTimeSeconds()) + 3600)
    nbf = [int]([DateTimeOffset]::Now.ToUnixTimeSeconds())
}

$headerEncoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $header)))
$payloadEncoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $payload)))

$cert = Get-PfxCertificate -FilePath "path\to\your_certificate.pfx" -Password (ConvertTo-SecureString -String "your_passphrase" -Force -AsPlainText)
$rsa = $cert.PrivateKey
$signature = [Convert]::ToBase64String($rsa.SignData([System.Text.Encoding]::UTF8.GetBytes("$headerEncoded.$payloadEncoded"), 'SHA256'))

$jwt = "$headerEncoded.$payloadEncoded.$signature"
Write-Output $jwt
