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


<#
.SYNOPSIS
    Retrieves user information from Azure Active Directory based on the provided User Principal Name (UPN).

.DESCRIPTION
    This script connects to Azure Active Directory, retrieves user details for the specified UPN, and returns the information as a PSCustomObject.

.PARAMETER UserPrincipalName
    The User Principal Name (UPN) of the user whose information is to be retrieved.

.EXAMPLE
    .\Get-AzureADUserInfo.ps1 -UserPrincipalName "user@domain.com"

.NOTES
    Author: Your Name
    Date:   November 5, 2024
#>

param (
    [Parameter(Mandatory = $true, HelpMessage = "Enter the User Principal Name (UPN) of the user.")]
    [string]$UserPrincipalName
)

try {
    # Connect to Azure AD
    Connect-AzureAD -ErrorAction Stop

    # Retrieve user information
    $user = Get-AzureADUser -ObjectId $UserPrincipalName -ErrorAction Stop

    if ($null -eq $user) {
        Write-Error "User with UPN '$UserPrincipalName' not found."
        return
    }

    # Create PSCustomObject with user details
    $userInfo = [PSCustomObject]@{
        DisplayName = $user.DisplayName
        Email       = $user.Mail
        Department  = $user.Department
        JobTitle    = $user.JobTitle
        MobilePhone = $user.Mobile
    }

    # Output user information
    return $userInfo
}
catch {
    Write-Error "An error occurred: $_"
}
finally {
    # Disconnect from Azure AD
    Disconnect-AzureAD
}


