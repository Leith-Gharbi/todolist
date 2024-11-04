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
    PowerShell script for automatically assigning or removing a phone number (lineURI) to/from a user in Microsoft Teams.

.DESCRIPTION
    This script connects to Microsoft Teams and Azure AD using an Azure AD application and a certificate, allowing for automated, unattended actions.
    It can either:
      - Add a user to an Azure AD group and assign them a phone number.
      - Remove a user from an Azure AD group and remove their phone number.
    The action type is controlled by the "Action" parameter.

.PARAMETER UserPrincipalName
    The User Principal Name (UPN) of the user for whom the action will be performed (e.g., user@domain.com).

.PARAMETER PhoneNumber
    The phone number to assign or remove, in international format (e.g., +1234567890).

.PARAMETER LogFile
    The full path to the log file where information will be recorded (e.g., C:\Logs\ManagePhoneNumber.log).

.PARAMETER Action
    Specifies the action to perform: "Assign" to add the user to the group and assign a phone number, "Remove" to remove the user from the group and delete their phone number.

.EXAMPLE
    .\AutomaticManagePhoneNumber.ps1 -UserPrincipalName "user@domain.com" -PhoneNumber "+1234567890" -LogFile "C:\Logs\ManagePhoneNumber.log" -Action "Assign"

    .\AutomaticManagePhoneNumber.ps1 -UserPrincipalName "user@domain.com" -PhoneNumber "+1234567890" -LogFile "C:\Logs\ManagePhoneNumber.log" -Action "Remove"

.NOTES
    - This script requires both the MicrosoftTeams and AzureAD modules.
    - Ensure that the Azure AD application has the necessary permissions.
    - The certificate must be installed in the CurrentUser\My store.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$UserPrincipalName,

    [Parameter(Mandatory=$true)]
    [string]$PhoneNumber,

    [Parameter(Mandatory=$true)]
    [string]$LogFile,

    [Parameter(Mandatory=$true)]
    [ValidateSet("Assign", "Remove")]
    [string]$Action
)

# Azure AD application settings
$TenantId = "your-tenant-id"        # Azure AD Tenant ID
$ClientId = "your-app-id"           # Application (AppId) ID
$CertificateThumbprint = "your-certificate-thumbprint" # Certificate thumbprint

# Azure AD Group ID
$GroupId = "your-group-id" # Replace with the actual ID of the group office365licences_teams_Phone_mobile

# Logging function
function Write-Log {
    param (
        [string]$Message
    )
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "$Timestamp - $Message"
    Add-Content -Path $LogFile -Value $LogMessage
    Write-Output $LogMessage
}

# Function to create response object
function Create-ResponseObject {
    param (
        [int]$Status,
        [string]$Message,
        [string]$Details
    )
    [PsCustomObject]@{
        Status  = $Status
        Message = $Message
        Details = $Details
    }
}

# Start process
Write-Log "Process started for user $UserPrincipalName with action $Action and phone number $PhoneNumber."

# Load certificate from the local store
try {
    Write-Log "Loading certificate with the specified thumbprint."
    $Certificate = Get-Item "Cert:\CurrentUser\My\$CertificateThumbprint"
    if (-not $Certificate) {
        Write-Log "Error: Certificate not found with the specified thumbprint."
        return Create-ResponseObject -Status 500 -Message "Failed" -Details "Certificate not found with the specified thumbprint."
    }
} catch {
    Write-Log "Error: $_"
    return Create-ResponseObject -Status 500 -Message "Failed" -Details $_.Exception.Message
}

# Connect to Microsoft Teams and Azure AD using certificate-based authentication
try {
    Write-Log "Attempting to connect to Microsoft Teams and Azure AD with certificate."
    Connect-MicrosoftTeams -TenantId $TenantId -ClientId $ClientId -CertificateThumbprint $CertificateThumbprint
    Connect-AzureAD -TenantId $TenantId -ClientId $ClientId -CertificateThumbprint $CertificateThumbprint
    Write-Log "Successfully connected to Microsoft Teams and Azure AD."
} catch {
    Write-Log "Connection error: $_"
    return Create-ResponseObject -Status 500 -Message "Failed" -Details $_.Exception.Message
}

# Perform action based on the Action parameter
if ($Action -eq "Assign") {
    try {
        # Add user to Azure AD group
        Write-Log "Searching for user $UserPrincipalName in Azure AD."
        $User = Get-AzureADUser -ObjectId $UserPrincipalName
        Write-Log "Adding user $UserPrincipalName to group $GroupId."
        Add-AzureADGroupMember -ObjectId $GroupId -RefObjectId $User.ObjectId
        Write-Log "Success: User $UserPrincipalName has been added to group $GroupId."
    } catch {
        Write-Log "Error adding user to group: $_"
        return Create-ResponseObject -Status 500 -Message "Failed" -Details $_.Exception.Message
    }

    try {
        # Validate phone number format
        if ($PhoneNumber -notmatch "^\+\d+$") {
            Write-Log "Error: Phone number must be in international format (e.g., +1234567890)."
            return Create-ResponseObject -Status 500 -Message "Failed" -Details "Phone number must be in international format (e.g., +1234567890)."
        }
        
        # Assign phone number to user
        Write-Log "Attempting to assign phone number $PhoneNumber to user $UserPrincipalName."
        Set-CsPhoneNumberAssignment -Identity $UserPrincipalName -PhoneNumber $PhoneNumber -PhoneNumberType CallingPlan
        Write-Log "Success: Phone number $PhoneNumber has been assigned to user $UserPrincipalName."
        return Create-ResponseObject -Status 200 -Message "Success" -Details "Operation Assign succeeded."
    } catch {
        Write-Log "Error assigning phone number: $_"
        return Create-ResponseObject -Status 500 -Message "Failed" -Details $_.Exception.Message
    }

} elseif ($Action -eq "Remove") {
    try {
        # Remove user from Azure AD group
        Write-Log "Searching for user $UserPrincipalName in Azure AD to remove from group."
        $User = Get-AzureADUser -ObjectId $UserPrincipalName
        Write-Log "Removing user $UserPrincipalName from group $GroupId."
        Remove-AzureADGroupMember -ObjectId $GroupId -MemberId $User.ObjectId
        Write-Log "Success: User $UserPrincipalName has been removed from group $GroupId."
    } catch {
        Write-Log "Error removing user from group: $_"
        return Create-ResponseObject -Status 500 -Message "Failed" -Details $_.Exception.Message
    }

    try {
        # Remove phone number from user
        Write-Log "Attempting to remove phone number for user $UserPrincipalName."
        Remove-CsPhoneNumberAssignment -Identity $UserPrincipalName
        Write-Log "Success: Phone number has been removed for user $UserPrincipalName."
        return Create-ResponseObject -Status 200 -Message "Success" -Details "Operation Remove succeeded."
    } catch {
        Write-Log "Error removing phone number: $_"
        return Create-ResponseObject -Status 500 -Message "Failed" -Details $_.Exception.Message
    }
}


